import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import f1_score, classification_report
import lightgbm as lgb
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

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

MAIN_CAREERS = [
    "Software Engineering", "Data & AI", "Core Engineering",
    "Medicine & Health", "Business & Finance", "Marketing & Communications",
    "Design & Media", "Science & Research", "Law & Public Policy",
    "Education & Training", "Entrepreneurship & Management", "Hospitality & Tourism"
]

SUB_TRACKS = {
    "Software Engineering": ["Frontend", "Backend", "Mobile", "DevOps", "QA/Automation"],
    "Data & AI": ["Data Scientist", "ML Engineer", "Data Analyst", "NLP", "Computer Vision"],
    "Core Engineering": ["Mechanical", "Electrical/Electronics", "Civil", "Mechatronics/Robotics", "Industrial"],
    "Medicine & Health": ["Medicine", "Nursing", "Pharmacy", "Biomed", "Public Health"],
    "Business & Finance": ["Accounting", "Corporate Finance", "Investment/Trading", "Operations", "HR"],
    "Marketing & Communications": ["Digital Marketing", "Content/Copy", "Brand", "PR/Comms", "Growth/SEO"],
    "Design & Media": ["Product/UI", "Graphic/Brand", "3D/CGI", "Film/Video", "Illustration"],
    "Science & Research": ["Physics", "Chemistry", "Biology", "Psychology", "Environmental"],
    "Law & Public Policy": ["Corporate Law", "Public Policy", "Compliance", "Criminology", "International Relations"],
    "Education & Training": ["K-12 Teacher", "Higher Ed", "Instructional Design", "Counseling", "EdTech"],
    "Entrepreneurship & Management": ["Founder", "Product Mgmt", "Project Mgmt", "Operations Mgmt", "Strategy/Consulting"],
    "Hospitality & Tourism": ["Hotel Mgmt", "Culinary", "Travel Ops", "Event Mgmt", "Customer Experience"]
}

# Behavioral question mapping to latent traits
def engineer_latent_traits(df):
    """Build latent behavioral traits from Q4-Q11"""
    df['latent_logic'] = 0
    df['latent_leadership'] = 0
    df['latent_creative_prod'] = 0
    df['latent_ops_org'] = 0
    df['latent_social_help'] = 0

    # Q4: Problem solving approach
    if 'q4_choice' in df.columns:
        logic_keywords = ['logic', 'break down', 'analyze', 'systematic']
        df['latent_logic'] += df['q4_choice'].str.lower().apply(
            lambda x: sum(1 for kw in logic_keywords if kw in str(x))
        ).clip(0, 3)

    # Q5: Design preference
    if 'q5_choice' in df.columns:
        design_keywords = ['design', 'visual', 'creative', 'aesthetic']
        df['latent_creative_prod'] += df['q5_choice'].str.lower().apply(
            lambda x: sum(1 for kw in design_keywords if kw in str(x))
        ).clip(0, 3)

    # Q6: Group project role
    if 'q6_choice' in df.columns:
        leadership_keywords = ['lead', 'assign', 'coordinate', 'manage']
        df['latent_leadership'] += df['q6_choice'].str.lower().apply(
            lambda x: sum(1 for kw in leadership_keywords if kw in str(x))
        ).clip(0, 3)

        ops_keywords = ['manage resources', 'schedule', 'organize']
        df['latent_ops_org'] += df['q6_choice'].str.lower().apply(
            lambda x: sum(1 for kw in ops_keywords if kw in str(x))
        ).clip(0, 3)

    # Q7: Helping others learn
    if 'q7_choice' in df.columns:
        social_keywords = ['explain', 'encourage', 'practice', 'resources', 'teach']
        df['latent_social_help'] += df['q7_choice'].str.lower().apply(
            lambda x: sum(1 for kw in social_keywords if kw in str(x))
        ).clip(0, 3)

    # Q8: Technology interaction
    if 'q8_choice' in df.columns:
        logic_keywords = ['understand', 'how things work', 'mechanics']
        df['latent_logic'] += df['q8_choice'].str.lower().apply(
            lambda x: sum(1 for kw in logic_keywords if kw in str(x))
        ).clip(0, 3)

        design_keywords = ['design', 'product', 'user experience']
        df['latent_creative_prod'] += df['q8_choice'].str.lower().apply(
            lambda x: sum(1 for kw in design_keywords if kw in str(x))
        ).clip(0, 3)

    # Q9: Free time activity
    if 'q9_choice' in df.columns:
        logic_keywords = ['how things work', 'build', 'experiment']
        df['latent_logic'] += df['q9_choice'].str.lower().apply(
            lambda x: sum(1 for kw in logic_keywords if kw in str(x))
        ).clip(0, 3)

    # Q10: Event planning
    if 'q10_choice' in df.columns:
        leadership_keywords = ['coordinate', 'assign tasks']
        df['latent_leadership'] += df['q10_choice'].str.lower().apply(
            lambda x: sum(1 for kw in leadership_keywords if kw in str(x))
        ).clip(0, 3)

        ops_keywords = ['checklist', 'budget', 'schedule', 'logistics']
        df['latent_ops_org'] += df['q10_choice'].str.lower().apply(
            lambda x: sum(1 for kw in ops_keywords if kw in str(x))
        ).clip(0, 3)

    # Q11: Creative project
    if 'q11_choice' in df.columns:
        creative_keywords = ['perform', 'promote', 'design', 'create']
        df['latent_creative_prod'] += df['q11_choice'].str.lower().apply(
            lambda x: sum(1 for kw in creative_keywords if kw in str(x))
        ).clip(0, 3)

    # Normalize to 0-3 range
    for col in ['latent_logic', 'latent_leadership', 'latent_creative_prod', 'latent_ops_org', 'latent_social_help']:
        df[col] = df[col].clip(0, 3)

    return df

def load_and_preprocess(csv_path):
    """Load CSV and engineer all features"""
    df = pd.read_csv(csv_path)

    # Impute missing computing scores (anti-bias rule)
    if 'computing_score_bin' in df.columns:
        df['computing_score_bin'] = df['computing_score_bin'].fillna("35–55")

    # Convert score bins to midpoints
    score_cols = ['math_score_bin', 'physics_score_bin', 'biology_score_bin',
                  'chemistry_score_bin', 'business_score_bin', 'economics_score_bin',
                  'arts_score_bin', 'psychology_score_bin', 'computing_score_bin']

    for col in score_cols:
        if col in df.columns:
            midpoint_col = col.replace('_bin', '_mid')
            df[midpoint_col] = df[col].map(BIN_MIDPOINTS)

    # Study hours
    if 'study_hours_per_day_bin' in df.columns:
        df['study_hours_per_day_mid'] = df['study_hours_per_day_bin'].map(STUDY_HOURS_MIDPOINTS)
    if 'self_study_hours_per_week_bin' in df.columns:
        df['self_study_hours_per_week_mid'] = df['self_study_hours_per_week_bin'].map(STUDY_HOURS_MIDPOINTS)

    # Binary features
    if 'extra_classes' in df.columns:
        df['extra_classes_bin'] = (df['extra_classes'] == 'Yes').astype(int)
    if 'extracurriculars' in df.columns:
        df['extracurriculars_bin'] = (df['extracurriculars'] == 'Yes').astype(int)

    # Engineer latent behavioral traits
    df = engineer_latent_traits(df)

    # Skills multi-hot (assumed already in 0/1 format)
    skill_cols = ['skill_problem_solving', 'skill_teamwork', 'skill_growth_mindset',
                  'skill_multitasking', 'skill_communication', 'skill_time_management',
                  'skill_digital_literacy', 'skill_leadership', 'skill_critical_thinking',
                  'skill_adaptability', 'skill_creativity', 'skill_decision_making']

    for col in skill_cols:
        if col not in df.columns:
            df[col] = 0

    return df

def build_feature_sets(df):
    """Separate academic and behavioral features"""
    academic_features = [
        'math_score_mid', 'physics_score_mid', 'biology_score_mid',
        'chemistry_score_mid', 'business_score_mid', 'economics_score_mid',
        'arts_score_mid', 'psychology_score_mid', 'computing_score_mid'
    ]

    behavioral_features = [
        'latent_logic', 'latent_leadership', 'latent_creative_prod',
        'latent_ops_org', 'latent_social_help',
        'study_hours_per_day_mid', 'self_study_hours_per_week_mid',
        'extra_classes_bin', 'extracurriculars_bin'
    ] + [f'skill_{s}' for s in ['problem_solving', 'teamwork', 'growth_mindset',
                                  'multitasking', 'communication', 'time_management',
                                  'digital_literacy', 'leadership', 'critical_thinking',
                                  'adaptability', 'creativity', 'decision_making']]

    # Filter to existing columns
    academic_features = [f for f in academic_features if f in df.columns]
    behavioral_features = [f for f in behavioral_features if f in df.columns]

    all_features = academic_features + behavioral_features

    return df[academic_features], df[behavioral_features], df[all_features], academic_features, behavioral_features, all_features

def train_centroid_models(df_train, academic_features, behavioral_features):
    """Build centroid-based scoring system"""
    X_acad = df_train[academic_features].fillna(df_train[academic_features].median())
    X_behav = df_train[behavioral_features].fillna(df_train[behavioral_features].median())

    scaler_A = StandardScaler()
    scaler_B = StandardScaler()

    X_acad_scaled = scaler_A.fit_transform(X_acad)
    X_behav_scaled = scaler_B.fit_transform(X_behav)

    # Build centroids per main career
    centroids = {'academic': {}, 'behavioral': {}}

    for career in MAIN_CAREERS:
        mask = df_train['label_main'] == career
        if mask.sum() > 0:
            centroids['academic'][career] = X_acad_scaled[mask].mean(axis=0)
            centroids['behavioral'][career] = X_behav_scaled[mask].mean(axis=0)

    return scaler_A, scaler_B, centroids

def train_hierarchical_classifier(df_train, df_val, all_features):
    """Train Stage A (main) and Stage B (sub) LightGBM classifiers with calibration"""
    X_train = df_train[all_features].fillna(df_train[all_features].median())
    y_train_main = df_train['label_main']

    X_val = df_val[all_features].fillna(df_val[all_features].median())
    y_val_main = df_val['label_main']

    # Stage A: Main career classifier
    lgb_main = lgb.LGBMClassifier(
        n_estimators=300,
        max_depth=8,
        learning_rate=0.05,
        class_weight='balanced',
        random_state=42,
        verbose=-1
    )

    lgb_main.fit(X_train, y_train_main)

    # Calibrate main classifier
    calibrated_main = CalibratedClassifierCV(lgb_main, method='isotonic', cv='prefit')
    calibrated_main.fit(X_val, y_val_main)

    # Stage B: Sub-track classifiers per main career
    sub_classifiers = {}

    for career in MAIN_CAREERS:
        mask_train = df_train['label_main'] == career
        mask_val = df_val['label_main'] == career

        if mask_train.sum() > 5 and mask_val.sum() > 0:
            X_sub_train = df_train[mask_train][all_features].fillna(df_train[all_features].median())
            y_sub_train = df_train[mask_train]['label_sub']

            X_sub_val = df_val[mask_val][all_features].fillna(df_val[all_features].median())
            y_sub_val = df_val[mask_val]['label_sub']

            lgb_sub = lgb.LGBMClassifier(
                n_estimators=200,
                max_depth=6,
                learning_rate=0.05,
                class_weight='balanced',
                random_state=42,
                verbose=-1
            )

            lgb_sub.fit(X_sub_train, y_sub_train)

            # Calibrate sub classifier
            if len(np.unique(y_sub_train)) > 1:
                calibrated_sub = CalibratedClassifierCV(lgb_sub, method='isotonic', cv='prefit')
                calibrated_sub.fit(X_sub_val, y_sub_val)
                sub_classifiers[career] = calibrated_sub
            else:
                sub_classifiers[career] = lgb_sub

    return calibrated_main, sub_classifiers

def main():
    """Main training pipeline"""
    print("=" * 60)
    print("Career Predictor ML Training Pipeline")
    print("=" * 60)

    # Load data
    csv_path = "ml/data/student-scores-transformed.csv"
    if not os.path.exists(csv_path):
        print(f"ERROR: Transformed dataset not found at {csv_path}")
        print("Please run: python ml/src/preprocess_dataset.py first")
        return

    print(f"\n[1/6] Loading dataset: {csv_path}")
    df = load_and_preprocess(csv_path)
    print(f"   Loaded {len(df)} samples")
    print(f"   Main careers: {df['label_main'].nunique()} classes")

    # Build feature sets
    print("\n[2/6] Engineering features...")
    X_acad, X_behav, X_all, acad_feats, behav_feats, all_feats = build_feature_sets(df)
    print(f"   Academic features: {len(acad_feats)}")
    print(f"   Behavioral features: {len(behav_feats)}")
    print(f"   Total features: {len(all_feats)}")

    # Train/val split
    df_train, df_val = train_test_split(
        df, test_size=0.2, stratify=df['label_main'], random_state=42
    )
    print(f"\n[3/6] Split: {len(df_train)} train, {len(df_val)} val")

    # Train centroid models
    print("\n[4/6] Training centroid models...")
    scaler_A, scaler_B, centroids = train_centroid_models(
        df_train, acad_feats, behav_feats
    )
    print(f"   Built centroids for {len(centroids['academic'])} careers")

    # Train hierarchical classifiers
    print("\n[5/6] Training hierarchical LightGBM classifiers...")
    main_classifier, sub_classifiers = train_hierarchical_classifier(
        df_train, df_val, all_feats
    )

    # Evaluate
    print("\n[6/6] Evaluating models...")
    X_val_full = df_val[all_feats].fillna(df_val[all_feats].median())
    y_pred_main = main_classifier.predict(X_val_full)

    main_f1 = f1_score(df_val['label_main'], y_pred_main, average='macro')
    print(f"   Main career macro-F1: {main_f1:.3f}")

    # Sub-track F1
    sub_f1_scores = []
    for career in MAIN_CAREERS:
        if career in sub_classifiers:
            mask = df_val['label_main'] == career
            if mask.sum() > 0:
                X_sub_val = df_val[mask][all_feats].fillna(df_val[all_feats].median())
                y_sub_val = df_val[mask]['label_sub']
                y_sub_pred = sub_classifiers[career].predict(X_sub_val)
                sub_f1 = f1_score(y_sub_val, y_sub_pred, average='macro', zero_division=0)
                sub_f1_scores.append(sub_f1)

    avg_sub_f1 = np.mean(sub_f1_scores) if sub_f1_scores else 0
    print(f"   Average sub-track F1: {avg_sub_f1:.3f}")

    # Save artifacts
    print("\n[Saving] Persisting models to ml/models/...")
    os.makedirs("ml/models", exist_ok=True)

    joblib.dump(scaler_A, "ml/models/scalerA.joblib")
    joblib.dump(scaler_B, "ml/models/scalerB.joblib")
    joblib.dump(centroids, "ml/models/centroids.pkl")
    joblib.dump(main_classifier, "ml/models/main_lgbm.pkl")
    joblib.dump(sub_classifiers, "ml/models/sub_classifiers.pkl")
    joblib.dump({
        'academic': acad_feats,
        'behavioral': behav_feats,
        'all': all_feats
    }, "ml/models/feature_names.pkl")

    print("   [OK] scalerA.joblib")
    print("   [OK] scalerB.joblib")
    print("   [OK] centroids.pkl")
    print("   [OK] main_lgbm.pkl")
    print("   [OK] sub_classifiers.pkl")
    print("   [OK] feature_names.pkl")

    # Self-check: score 3 random samples
    print("\n[Self-check] Scoring 3 random validation samples...")
    test_samples = df_val.sample(3, random_state=999)

    for idx, row in test_samples.iterrows():
        X_test = row[all_feats].fillna(df_val[all_feats].median()).values.reshape(1, -1)

        # Centroid scores
        X_acad_test = scaler_A.transform(row[acad_feats].fillna(df_train[acad_feats].median()).values.reshape(1, -1))
        X_behav_test = scaler_B.transform(row[behav_feats].fillna(df_train[behav_feats].median()).values.reshape(1, -1))

        scores = []
        for career in MAIN_CAREERS:
            if career in centroids['academic']:
                cos_A = np.dot(X_acad_test[0], centroids['academic'][career]) / (
                    np.linalg.norm(X_acad_test[0]) * np.linalg.norm(centroids['academic'][career]) + 1e-8
                )
                cos_B = np.dot(X_behav_test[0], centroids['behavioral'][career]) / (
                    np.linalg.norm(X_behav_test[0]) * np.linalg.norm(centroids['behavioral'][career]) + 1e-8
                )
                A = 100 * (cos_A + 1) / 2
                B = 100 * (cos_B + 1) / 2
                S = 0.6 * A + 0.4 * B
                scores.append((career, S))

        scores.sort(key=lambda x: x[1], reverse=True)

        # Classifier probs
        probs = main_classifier.predict_proba(X_test)[0]
        classes = main_classifier.classes_
        class_probs = list(zip(classes, probs))
        class_probs.sort(key=lambda x: x[1], reverse=True)

        print(f"\n   Sample {idx} (True: {row['label_main']} / {row['label_sub']})")
        print(f"      Top-3 centroid: {scores[0][0]} ({scores[0][1]:.1f}), {scores[1][0]} ({scores[1][1]:.1f}), {scores[2][0]} ({scores[2][1]:.1f})")
        print(f"      Top-3 classifier: {class_probs[0][0]} ({class_probs[0][1]:.2f}), {class_probs[1][0]} ({class_probs[1][1]:.2f}), {class_probs[2][0]} ({class_probs[2][1]:.2f})")

    print("\n" + "=" * 60)
    print("Training complete! Models saved to ml/models/")
    print("=" * 60)

if __name__ == "__main__":
    main()
