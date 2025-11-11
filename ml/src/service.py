from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
import numpy as np
import joblib
import os
from scipy.spatial.distance import cosine

app = FastAPI(title="Career Predictor ML Service")

# Constants
BIN_MIDPOINTS = {
    "0–35": 17.5,
    "35–55": 45.0,
    "55–75": 65.0,
    "75–100": 87.5
}

STUDY_HOURS_MIDPOINTS = {
    "0–3": 1.5,
    "3–6": 4.5,
    "6–10": 8.0,
    "10–15": 12.5
}

CENTROID_WEIGHT = 0.5
CLASSIFIER_WEIGHT = 0.5
MIN_GAP_THRESHOLD = 0.08
LOW_CONFIDENCE_S_GAP = 3.0

# Global model artifacts
models = {}

def load_models():
    """Load all trained artifacts on startup"""
    model_dir = "ml/models"

    if not os.path.exists(model_dir):
        raise RuntimeError(f"Models directory not found: {model_dir}")

    models['scaler_A'] = joblib.load(f"{model_dir}/scalerA.joblib")
    models['scaler_B'] = joblib.load(f"{model_dir}/scalerB.joblib")
    models['centroids'] = joblib.load(f"{model_dir}/centroids.pkl")
    models['main_classifier'] = joblib.load(f"{model_dir}/main_lgbm.pkl")
    models['sub_classifiers'] = joblib.load(f"{model_dir}/sub_classifiers.pkl")
    models['feature_names'] = joblib.load(f"{model_dir}/feature_names.pkl")

    print("✓ All models loaded successfully")

@app.on_event("startup")
async def startup_event():
    load_models()

class AssessmentPayload(BaseModel):
    """Input schema for scoring request"""
    # Academic bins
    math_score_bin: str
    physics_score_bin: str
    biology_score_bin: str
    chemistry_score_bin: str
    business_score_bin: str
    economics_score_bin: str
    arts_score_bin: str
    psychology_score_bin: str
    computing_score_bin: str

    # Study habits
    study_hours_per_day_bin: str
    self_study_hours_per_week_bin: str
    extra_classes: str
    extracurriculars: str

    # Behavioral Q4-Q11
    q4_choice: str
    q5_choice: str
    q6_choice: str
    q7_choice: str
    q8_choice: str
    q9_choice: str
    q10_choice: str
    q11_choice: str

    # Skills (multi-hot)
    skill_problem_solving: int
    skill_teamwork: int
    skill_growth_mindset: int
    skill_multitasking: int
    skill_communication: int
    skill_time_management: int
    skill_digital_literacy: int
    skill_leadership: int
    skill_critical_thinking: int
    skill_adaptability: int
    skill_creativity: int
    skill_decision_making: int

    # Optional text
    career_intent_text: Optional[str] = ""

class CareerScore(BaseModel):
    career: str
    A: float
    B: float
    S: float
    S_final: float
    ci: Optional[List[float]] = None

class CounterfactualSuggestion(BaseModel):
    career: str
    current_score: float
    suggestions: List[str]

class PredictionResponse(BaseModel):
    top_career: Dict[str, str]
    topN: List[CareerScore]
    low_confidence: bool
    reasons: List[str]
    counterfactuals: Optional[List[CounterfactualSuggestion]] = None

def engineer_latent_traits(payload: Dict) -> Dict:
    """Build latent traits from Q4-Q11"""
    latent = {
        'latent_logic': 0,
        'latent_leadership': 0,
        'latent_creative_prod': 0,
        'latent_ops_org': 0,
        'latent_social_help': 0
    }

    # Q4: Problem solving
    q4 = payload.get('q4_choice', '').lower()
    if any(kw in q4 for kw in ['logic', 'break down', 'analyze', 'systematic']):
        latent['latent_logic'] += 2

    # Q5: Design preference
    q5 = payload.get('q5_choice', '').lower()
    if any(kw in q5 for kw in ['design', 'visual', 'creative', 'aesthetic']):
        latent['latent_creative_prod'] += 2

    # Q6: Group role
    q6 = payload.get('q6_choice', '').lower()
    if any(kw in q6 for kw in ['lead', 'assign', 'coordinate']):
        latent['latent_leadership'] += 2
    if any(kw in q6 for kw in ['manage resources', 'organize']):
        latent['latent_ops_org'] += 2

    # Q7: Helping others
    q7 = payload.get('q7_choice', '').lower()
    if any(kw in q7 for kw in ['explain', 'encourage', 'practice', 'resources', 'teach']):
        latent['latent_social_help'] += 2

    # Q8: Technology
    q8 = payload.get('q8_choice', '').lower()
    if any(kw in q8 for kw in ['understand', 'how things work', 'mechanics']):
        latent['latent_logic'] += 2
    if any(kw in q8 for kw in ['design', 'product', 'user experience']):
        latent['latent_creative_prod'] += 1

    # Q9: Free time
    q9 = payload.get('q9_choice', '').lower()
    if any(kw in q9 for kw in ['how things work', 'build', 'experiment']):
        latent['latent_logic'] += 1

    # Q10: Event planning
    q10 = payload.get('q10_choice', '').lower()
    if any(kw in q10 for kw in ['coordinate', 'assign tasks']):
        latent['latent_leadership'] += 1
    if any(kw in q10 for kw in ['checklist', 'budget', 'schedule', 'logistics']):
        latent['latent_ops_org'] += 2

    # Q11: Creative project
    q11 = payload.get('q11_choice', '').lower()
    if any(kw in q11 for kw in ['perform', 'promote', 'design', 'create']):
        latent['latent_creative_prod'] += 2

    # Clip to 0-3
    for key in latent:
        latent[key] = min(3, latent[key])

    return latent

def payload_to_features(payload: AssessmentPayload) -> Dict:
    """Convert API payload to feature dict"""
    payload_dict = payload.dict()

    # Academic midpoints
    features = {
        'math_score_mid': BIN_MIDPOINTS.get(payload.math_score_bin, 45.0),
        'physics_score_mid': BIN_MIDPOINTS.get(payload.physics_score_bin, 45.0),
        'biology_score_mid': BIN_MIDPOINTS.get(payload.biology_score_bin, 45.0),
        'chemistry_score_mid': BIN_MIDPOINTS.get(payload.chemistry_score_bin, 45.0),
        'business_score_mid': BIN_MIDPOINTS.get(payload.business_score_bin, 45.0),
        'economics_score_mid': BIN_MIDPOINTS.get(payload.economics_score_bin, 45.0),
        'arts_score_mid': BIN_MIDPOINTS.get(payload.arts_score_bin, 45.0),
        'psychology_score_mid': BIN_MIDPOINTS.get(payload.psychology_score_bin, 45.0),
        'computing_score_mid': BIN_MIDPOINTS.get(payload.computing_score_bin, 45.0)
    }

    # Study habits
    features['study_hours_per_day_mid'] = STUDY_HOURS_MIDPOINTS.get(payload.study_hours_per_day_bin, 1.5)
    features['self_study_hours_per_week_mid'] = STUDY_HOURS_MIDPOINTS.get(payload.self_study_hours_per_week_bin, 1.5)
    features['extra_classes_bin'] = 1 if payload.extra_classes == "Yes" else 0
    features['extracurriculars_bin'] = 1 if payload.extracurriculars == "Yes" else 0

    # Latent traits
    latent = engineer_latent_traits(payload_dict)
    features.update(latent)

    # Skills
    for skill in ['problem_solving', 'teamwork', 'growth_mindset', 'multitasking',
                  'communication', 'time_management', 'digital_literacy', 'leadership',
                  'critical_thinking', 'adaptability', 'creativity', 'decision_making']:
        features[f'skill_{skill}'] = getattr(payload, f'skill_{skill}')

    return features

def compute_centroid_scores(features: Dict) -> Dict[str, Dict[str, float]]:
    """Compute A, B, S scores for all careers using centroids"""
    scaler_A = models['scaler_A']
    scaler_B = models['scaler_B']
    centroids = models['centroids']
    feature_names = models['feature_names']

    acad_feats = feature_names['academic']
    behav_feats = feature_names['behavioral']

    # Extract and scale features
    X_acad = np.array([features.get(f, 45.0) for f in acad_feats]).reshape(1, -1)
    X_behav = np.array([features.get(f, 0) for f in behav_feats]).reshape(1, -1)

    X_acad_scaled = scaler_A.transform(X_acad)[0]
    X_behav_scaled = scaler_B.transform(X_behav)[0]

    scores = {}

    for career, centroid_A in centroids['academic'].items():
        centroid_B = centroids['behavioral'][career]

        # Cosine similarity
        cos_A = 1 - cosine(X_acad_scaled, centroid_A)
        cos_B = 1 - cosine(X_behav_scaled, centroid_B)

        # Map to 0-100
        A = 100 * (cos_A + 1) / 2
        B = 100 * (cos_B + 1) / 2
        S = 0.6 * A + 0.4 * B

        scores[career] = {'A': A, 'B': B, 'S': S}

    return scores

def compute_classifier_probs(features: Dict) -> Dict[str, float]:
    """Get classifier probabilities for main careers"""
    main_classifier = models['main_classifier']
    feature_names = models['feature_names']
    all_feats = feature_names['all']

    X = np.array([features.get(f, 0) for f in all_feats]).reshape(1, -1)
    probs = main_classifier.predict_proba(X)[0]
    classes = main_classifier.classes_

    return dict(zip(classes, probs))

def get_sub_track(main_career: str, features: Dict) -> str:
    """Predict sub-track for a given main career"""
    sub_classifiers = models['sub_classifiers']
    feature_names = models['feature_names']
    all_feats = feature_names['all']

    if main_career not in sub_classifiers:
        # Return first sub if no classifier
        from train import SUB_TRACKS
        return SUB_TRACKS.get(main_career, ["General"])[0]

    X = np.array([features.get(f, 0) for f in all_feats]).reshape(1, -1)
    sub = sub_classifiers[main_career].predict(X)[0]
    return sub

def apply_anti_collapse_rules(centroid_scores: Dict, classifier_probs: Dict, features: Dict) -> Dict[str, float]:
    """Apply sanity checks and anti-collapse rules"""
    # Subject sanity: high computing + math should favor Software/Data
    computing = features.get('computing_score_mid', 45.0)
    math = features.get('math_score_mid', 45.0)

    if computing >= 65 and math >= 65:
        # Boost Software Engineering and Data & AI
        if 'Software Engineering' in classifier_probs:
            classifier_probs['Software Engineering'] = min(1.0, classifier_probs['Software Engineering'] * 1.3)
        if 'Data & AI' in classifier_probs:
            classifier_probs['Data & AI'] = min(1.0, classifier_probs['Data & AI'] * 1.3)

        # Normalize
        total = sum(classifier_probs.values())
        if total > 0:
            classifier_probs = {k: v / total for k, v in classifier_probs.items()}

    return classifier_probs

def generate_counterfactuals(features: Dict, centroid_scores: Dict, topN: List, top_career: str) -> List[CounterfactualSuggestion]:
    """Generate counterfactual explanations for top-3 non-top careers"""
    counterfactuals = []

    # Get careers other than top
    other_careers = [c for c in topN[1:4] if c['career'] != top_career]

    for career_info in other_careers[:2]:  # Top 2 alternatives
        career = career_info['career']
        current_score = career_info['S_final']
        suggestions = []

        # Analyze academic gaps
        if career in ['Software Engineering', 'Data & AI']:
            if features.get('computing_score_mid', 0) < 65:
                suggestions.append("Improve computing fundamentals (aim for 65+ score)")
            if features.get('math_score_mid', 0) < 65:
                suggestions.append("Strengthen math skills (aim for 65+ score)")

        elif career in ['Medicine & Health', 'Science & Research']:
            if features.get('biology_score_mid', 0) < 70:
                suggestions.append("Build stronger biology foundation (aim for 70+)")
            if features.get('chemistry_score_mid', 0) < 70:
                suggestions.append("Strengthen chemistry knowledge (aim for 70+)")

        elif career in ['Business & Finance']:
            if features.get('math_score_mid', 0) < 60:
                suggestions.append("Develop analytical/math skills (aim for 60+)")
            if features.get('business_score_mid', 0) < 60:
                suggestions.append("Learn business fundamentals")

        elif career in ['Design & Media', 'Marketing & Communications']:
            if features.get('arts_score_mid', 0) < 65:
                suggestions.append("Develop creative/artistic skills")
            if features.get('skill_creativity', 0) == 0:
                suggestions.append("Build a portfolio of creative projects")

        # Analyze behavioral gaps
        if career in ['Software Engineering', 'Data & AI', 'Core Engineering']:
            if features.get('latent_logic', 0) < 2:
                suggestions.append("Practice systematic problem-solving approaches")
            if features.get('skill_critical_thinking', 0) == 0:
                suggestions.append("Develop critical thinking through puzzles and analysis")

        elif career in ['Entrepreneurship & Management', 'Business & Finance']:
            if features.get('latent_leadership', 0) < 2:
                suggestions.append("Gain leadership experience through team projects")
            if features.get('skill_decision_making', 0) == 0:
                suggestions.append("Practice making data-driven decisions")

        elif career in ['Education & Training', 'Hospitality & Tourism']:
            if features.get('latent_social_help', 0) < 2:
                suggestions.append("Volunteer or tutor to build helping skills")
            if features.get('skill_communication', 0) == 0:
                suggestions.append("Improve communication through presentations or writing")

        # Study habits
        if features.get('study_hours_per_day_mid', 0) < 4.5:
            suggestions.append("Increase daily focused study time to 3-6 hours")

        # Limit to top 3 most actionable
        if not suggestions:
            suggestions.append(f"Your profile already aligns well with {career}")

        counterfactuals.append(CounterfactualSuggestion(
            career=career,
            current_score=round(current_score, 1),
            suggestions=suggestions[:3]
        ))

    return counterfactuals

def generate_reasons(top_career: str, features: Dict, centroid_scores: Dict) -> List[str]:
    """Generate 2-4 human-readable reasons"""
    reasons = []

    # Academic standouts
    acad_scores = {
        'computing': features.get('computing_score_mid', 45.0),
        'math': features.get('math_score_mid', 45.0),
        'business': features.get('business_score_mid', 45.0),
        'arts': features.get('arts_score_mid', 45.0),
        'biology': features.get('biology_score_mid', 45.0)
    }

    high_subjects = [k for k, v in acad_scores.items() if v >= 65]

    if high_subjects:
        subj_str = ', '.join([f"{s} ({acad_scores[s]:.0f})" for s in high_subjects[:2]])
        reasons.append(f"Strong academic alignment: {subj_str}")

    # Behavioral traits
    latent = {
        'logic': features.get('latent_logic', 0),
        'leadership': features.get('latent_leadership', 0),
        'creative': features.get('latent_creative_prod', 0)
    }

    if latent['logic'] >= 2:
        reasons.append("Logic-first problem-solving approach (Q4, Q8)")

    if latent['creative'] >= 2:
        reasons.append("Creative and design-oriented preferences (Q5, Q11)")

    if latent['leadership'] >= 2:
        reasons.append("Leadership and coordination strengths (Q6, Q10)")

    # Skills
    skills = []
    for skill in ['digital_literacy', 'critical_thinking', 'problem_solving', 'creativity']:
        if features.get(f'skill_{skill}', 0) == 1:
            skills.append(skill.replace('_', ' '))

    if skills:
        reasons.append(f"Key skills: {', '.join(skills[:3])}")

    # Centroid alignment
    A = centroid_scores[top_career]['A']
    B = centroid_scores[top_career]['B']

    if A >= 80 or B >= 80:
        reasons.append(f"High centroid match (A: {A:.0f}, B: {B:.0f}) with {top_career}")

    # Return top 4
    return reasons[:4] if len(reasons) >= 4 else reasons

def bootstrap_confidence_interval(X_acad_scaled, X_behav_scaled, centroid_A, centroid_B, n_boot=100):
    """Bootstrap CI for S score"""
    S_samples = []

    for _ in range(n_boot):
        # Add small noise
        X_acad_boot = X_acad_scaled + np.random.normal(0, 0.1, X_acad_scaled.shape)
        X_behav_boot = X_behav_scaled + np.random.normal(0, 0.1, X_behav_scaled.shape)

        cos_A = 1 - cosine(X_acad_boot, centroid_A)
        cos_B = 1 - cosine(X_behav_boot, centroid_B)

        A = 100 * (cos_A + 1) / 2
        B = 100 * (cos_B + 1) / 2
        S = 0.6 * A + 0.4 * B

        S_samples.append(S)

    return [np.percentile(S_samples, 5), np.percentile(S_samples, 95)]

@app.post("/score", response_model=PredictionResponse)
async def score_assessment(payload: AssessmentPayload):
    """Score an assessment and return top-N careers with reasoning"""
    try:
        # Convert payload to features
        features = payload_to_features(payload)

        # Compute centroid scores
        centroid_scores = compute_centroid_scores(features)

        # Compute classifier probs
        classifier_probs = compute_classifier_probs(features)

        # Apply anti-collapse rules
        classifier_probs = apply_anti_collapse_rules(centroid_scores, classifier_probs, features)

        # Blend scores: S_final = 0.5 * S_centroid + 0.5 * (100 * p_classifier)
        blended_scores = []

        for career in centroid_scores:
            S_centroid = centroid_scores[career]['S']
            p_classifier = classifier_probs.get(career, 0.01)
            S_final = CENTROID_WEIGHT * S_centroid + CLASSIFIER_WEIGHT * (100 * p_classifier)

            blended_scores.append({
                'career': career,
                'A': centroid_scores[career]['A'],
                'B': centroid_scores[career]['B'],
                'S': S_centroid,
                'S_final': S_final,
                'p_classifier': p_classifier
            })

        # Sort by S_final
        blended_scores.sort(key=lambda x: x['S_final'], reverse=True)

        # Check confidence
        top1 = blended_scores[0]
        top2 = blended_scores[1]

        S_gap = top1['S_final'] - top2['S_final']
        p_gap = top1['p_classifier'] - top2['p_classifier']

        low_confidence = (S_gap < LOW_CONFIDENCE_S_GAP) or (p_gap < MIN_GAP_THRESHOLD)

        # Get sub-track for top career
        top_main = top1['career']
        top_sub = get_sub_track(top_main, features)

        # If low confidence, also get sub for 2nd career
        if low_confidence and len(blended_scores) > 1:
            _ = get_sub_track(top2['career'], features)

        # Generate reasons
        reasons = generate_reasons(top_main, features, centroid_scores)

        # Generate counterfactual explanations
        counterfactuals = generate_counterfactuals(features, centroid_scores, blended_scores, top_main)

        # Optional: Bootstrap CI for top career (lightweight)
        scaler_A = models['scaler_A']
        scaler_B = models['scaler_B']
        centroids = models['centroids']
        feature_names = models['feature_names']

        acad_feats = feature_names['academic']
        behav_feats = feature_names['behavioral']

        X_acad = np.array([features.get(f, 45.0) for f in acad_feats])
        X_behav = np.array([features.get(f, 0) for f in behav_feats])

        X_acad_scaled = scaler_A.transform(X_acad.reshape(1, -1))[0]
        X_behav_scaled = scaler_B.transform(X_behav.reshape(1, -1))[0]

        ci = bootstrap_confidence_interval(
            X_acad_scaled, X_behav_scaled,
            centroids['academic'][top_main],
            centroids['behavioral'][top_main],
            n_boot=100
        )

        # Build response
        topN = []
        for i, score in enumerate(blended_scores[:5]):
            topN.append(CareerScore(
                career=score['career'],
                A=round(score['A'], 1),
                B=round(score['B'], 1),
                S=round(score['S'], 1),
                S_final=round(score['S_final'], 1),
                ci=[round(ci[0], 1), round(ci[1], 1)] if i == 0 else None
            ))

        return PredictionResponse(
            top_career={'main': top_main, 'sub': top_sub},
            topN=topN,
            low_confidence=low_confidence,
            reasons=reasons,
            counterfactuals=counterfactuals
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Scoring error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok", "models_loaded": len(models) > 0}
