from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pickle
import numpy as np
from scipy.spatial.distance import cosine
from typing import List, Dict, Any, Optional
import os

app = FastAPI(title="Career Prediction ML Service", version="1.0.0")

# Global variables for loaded models
scaler_academic = None
scaler_behavioral = None
centroids = None
lgb_model = None
label_encoder = None

# Data models
class PredictionRequest(BaseModel):
    math_score: float
    physics_score: float
    chemistry_score: float
    biology_score: float
    english_score: float
    history_score: float
    geography_score: float
    weekly_self_study_hours: float
    absence_days: float
    extracurricular_activities: int  # 0 or 1
    part_time_job: int  # 0 or 1

class CareerScore(BaseModel):
    career: str
    A: float  # Academic score 0-100
    B: float  # Behavioral score 0-100
    S: float  # Final weighted score 0-100
    ci: Optional[List[float]] = None  # Confidence interval [lower, upper]

class PredictionResponse(BaseModel):
    top_career: str
    topN: List[CareerScore]
    low_confidence: bool
    reasons: List[str]

def load_models():
    """Load all ML artifacts on startup"""
    global scaler_academic, scaler_behavioral, centroids, lgb_model, label_encoder
    
    try:
        # Load scalers
        scaler_academic = joblib.load('../models/scalerA.joblib')
        scaler_behavioral = joblib.load('../models/scalerB.joblib')
        
        # Load centroids
        with open('../models/centroids.pkl', 'rb') as f:
            centroids = pickle.load(f)
        
        # Load LightGBM model (optional)
        try:
            import lightgbm as lgb
            lgb_model = lgb.Booster(model_file='../models/lightgbm_classifier.txt')
            label_encoder = joblib.load('../models/label_encoder.joblib')
        except Exception as e:
            print(f"Warning: Could not load LightGBM model: {e}")
            lgb_model = None
            label_encoder = None
        
        print("All models loaded successfully!")
        
    except Exception as e:
        print(f"Error loading models: {e}")
        raise

def calculate_career_scores(features: PredictionRequest, w_academic=0.6, w_behavioral=0.4):
    """Calculate per-career A, B, S scores using cosine similarity with centroids"""
    
    # Prepare academic and behavioral features
    academic_features = np.array([
        features.math_score,
        features.physics_score, 
        features.chemistry_score,
        features.biology_score,
        features.english_score,
        features.history_score,
        features.geography_score
    ]).reshape(1, -1)
    
    behavioral_features = np.array([
        features.weekly_self_study_hours,
        features.absence_days,
        features.extracurricular_activities,
        features.part_time_job
    ]).reshape(1, -1)
    
    # Standardize features
    academic_scaled = scaler_academic.transform(academic_features)[0]
    behavioral_scaled = scaler_behavioral.transform(behavioral_features)[0]
    
    scores = {}
    
    for career in centroids['academic'].keys():
        # Calculate cosine similarity (1 - cosine distance)
        cos_academic = 1 - cosine(academic_scaled, centroids['academic'][career])
        cos_behavioral = 1 - cosine(behavioral_scaled, centroids['behavioral'][career])
        
        # Handle edge case where cosine might be NaN
        if np.isnan(cos_academic):
            cos_academic = 0
        if np.isnan(cos_behavioral):
            cos_behavioral = 0
            
        # Map cosine similarity [-1, 1] to [0, 100] scale
        A = 100 * ((cos_academic + 1) / 2)
        B = 100 * ((cos_behavioral + 1) / 2)
        
        # Final weighted score
        S = w_academic * A + w_behavioral * B
        
        # Clamp to valid range
        A = max(0, min(100, A))
        B = max(0, min(100, B))
        S = max(0, min(100, S))
        
        scores[career] = {
            'A': round(A, 1),
            'B': round(B, 1),
            'S': round(S, 1)
        }
    
    return scores

def generate_confidence_intervals(features: PredictionRequest, scores: Dict, n_bootstrap=300):
    """Generate confidence intervals using bootstrap sampling on centroids"""
    
    career_cis = {}
    
    for career in scores.keys():
        s_scores = []
        
        # Bootstrap sampling - add noise to centroids and recalculate
        for _ in range(n_bootstrap):
            # Add small gaussian noise to centroids
            noise_academic = np.random.normal(0, 0.1, len(centroids['academic'][career]))
            noise_behavioral = np.random.normal(0, 0.1, len(centroids['behavioral'][career]))
            
            # Perturbed centroids
            centroid_academic_perturbed = centroids['academic'][career] + noise_academic
            centroid_behavioral_perturbed = centroids['behavioral'][career] + noise_behavioral
            
            # Prepare student features
            academic_features = np.array([
                features.math_score, features.physics_score, features.chemistry_score,
                features.biology_score, features.english_score, features.history_score,
                features.geography_score
            ]).reshape(1, -1)
            
            behavioral_features = np.array([
                features.weekly_self_study_hours, features.absence_days,
                features.extracurricular_activities, features.part_time_job
            ]).reshape(1, -1)
            
            academic_scaled = scaler_academic.transform(academic_features)[0]
            behavioral_scaled = scaler_behavioral.transform(behavioral_features)[0]
            
            # Calculate score with perturbed centroid
            cos_academic = 1 - cosine(academic_scaled, centroid_academic_perturbed)
            cos_behavioral = 1 - cosine(behavioral_scaled, centroid_behavioral_perturbed)
            
            if np.isnan(cos_academic):
                cos_academic = 0
            if np.isnan(cos_behavioral):
                cos_behavioral = 0
            
            A = 100 * ((cos_academic + 1) / 2)
            B = 100 * ((cos_behavioral + 1) / 2)
            S = 0.6 * A + 0.4 * B
            
            s_scores.append(max(0, min(100, S)))
        
        # Calculate 95% confidence interval
        ci_lower = np.percentile(s_scores, 2.5)
        ci_upper = np.percentile(s_scores, 97.5)
        career_cis[career] = [round(ci_lower, 1), round(ci_upper, 1)]
    
    return career_cis

def generate_reasons(features: PredictionRequest, top_career: str):
    """Generate interpretable reasons for the top career prediction"""
    reasons = []
    
    # Get academic centroid for top career
    academic_centroid = centroids['academic'][top_career]
    behavioral_centroid = centroids['behavioral'][top_career]
    
    # Prepare student features and standardize
    student_academic = np.array([
        features.math_score, features.physics_score, features.chemistry_score,
        features.biology_score, features.english_score, features.history_score,
        features.geography_score
    ]).reshape(1, -1)
    
    student_behavioral = np.array([
        features.weekly_self_study_hours, features.absence_days,
        features.extracurricular_activities, features.part_time_job
    ]).reshape(1, -1)
    
    student_academic_scaled = scaler_academic.transform(student_academic)[0]
    student_behavioral_scaled = scaler_behavioral.transform(student_behavioral)[0]
    
    # Calculate feature differences (z-score differences)
    academic_diff = student_academic_scaled - academic_centroid
    behavioral_diff = student_behavioral_scaled - behavioral_centroid
    
    academic_feature_names = centroids['feature_names']['academic']
    behavioral_feature_names = centroids['feature_names']['behavioral']
    
    # Find strongest academic alignments
    for i, (feature, diff) in enumerate(zip(academic_feature_names, academic_diff)):
        if abs(diff) > 0.5:  # Significant difference threshold
            if diff > 0:
                reasons.append(f"Strong {feature.replace('_', ' ')} (+{diff:.1f}σ vs {top_career} typical)")
            else:
                reasons.append(f"Lower {feature.replace('_', ' ')} ({diff:.1f}σ vs {top_career} typical)")
    
    # Find strongest behavioral alignments
    for i, (feature, diff) in enumerate(zip(behavioral_feature_names, behavioral_diff)):
        if abs(diff) > 0.5:
            if feature == 'absence_days':
                # Remember we inverted absence_days, so positive diff means lower actual absences
                if diff > 0:
                    reasons.append(f"Low absence pattern (+{diff:.1f}σ) supports disciplined study")
                else:
                    reasons.append(f"Higher absence pattern ({diff:.1f}σ) vs {top_career} norms")
            elif feature == 'weekly_self_study_hours':
                if diff > 0:
                    reasons.append(f"High self-study commitment (+{diff:.1f}σ) aligns with {top_career}")
                else:
                    reasons.append(f"Lower study hours ({diff:.1f}σ) vs {top_career} typical")
            elif feature in ['extracurricular_activities', 'part_time_job']:
                if diff > 0:
                    reasons.append(f"{feature.replace('_', ' ').title()} involvement matches {top_career} profile")
    
    # Limit to top 4 most significant reasons
    return reasons[:4] if reasons else [f"Overall academic and behavioral profile matches {top_career}"]

@app.on_event("startup")
async def startup_event():
    """Load models when API starts"""
    load_models()

@app.get("/")
async def root():
    return {"message": "Career Prediction ML Service is running!", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    models_loaded = all([
        scaler_academic is not None,
        scaler_behavioral is not None,
        centroids is not None
    ])
    
    return {
        "status": "healthy" if models_loaded else "unhealthy",
        "models_loaded": models_loaded,
        "available_careers": list(centroids['academic'].keys()) if centroids else []
    }

@app.post("/score", response_model=PredictionResponse)
async def predict_career(request: PredictionRequest):
    """
    Predict career scores and recommendations based on student features
    """
    
    if not all([scaler_academic, scaler_behavioral, centroids]):
        raise HTTPException(status_code=500, detail="Models not loaded properly")
    
    try:
        # Calculate career scores
        scores = calculate_career_scores(request)
        
        # Generate confidence intervals
        confidence_intervals = generate_confidence_intervals(request, scores)
        
        # Sort careers by S score (descending)
        sorted_careers = sorted(scores.items(), key=lambda x: x[1]['S'], reverse=True)
        
        # Top career
        top_career = sorted_careers[0][0]
        
        # Generate reasons
        reasons = generate_reasons(request, top_career)
        
        # Check confidence (low if top two scores are very close)
        top_score = sorted_careers[0][1]['S']
        second_score = sorted_careers[1][1]['S'] if len(sorted_careers) > 1 else 0
        score_difference = top_score - second_score
        
        # Also check if confidence intervals overlap significantly
        top_ci = confidence_intervals[sorted_careers[0][0]]
        second_ci = confidence_intervals[sorted_careers[1][0]] if len(sorted_careers) > 1 else [0, 0]
        ci_overlap = top_ci[0] < second_ci[1] and second_ci[0] < top_ci[1]
        
        low_confidence = score_difference < 3 or ci_overlap
        
        # Prepare top N results (top 5)
        topN = []
        for career, career_scores in sorted_careers[:5]:
            topN.append(CareerScore(
                career=career,
                A=career_scores['A'],
                B=career_scores['B'],
                S=career_scores['S'],
                ci=confidence_intervals[career]
            ))
        
        return PredictionResponse(
            top_career=top_career,
            topN=topN,
            low_confidence=low_confidence,
            reasons=reasons
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001, reload=True)