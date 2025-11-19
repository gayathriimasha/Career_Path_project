import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
import joblib

def extract_features(df):
    """
    Extract and engineer features from raw question responses
    Combines behavioral and academic information with domain knowledge
    """
    features = pd.DataFrame()

    # Behavioral questions (q4-q23): 20 questions with 4 options each
    for q_id in range(4, 24):
        col = f"q{q_id}"
        if col in df.columns:
            features[col] = df[col]

    # Academic scores (q24-q30): Convert to normalized scale
    # q24: mathematics, q25: science, q26: biology, q27: business
    # q28: computer science, q29: arts, q30: social sciences
    academic_cols = [f"q{i}" for i in range(24, 31)]
    for col in academic_cols:
        if col in df.columns:
            features[col] = df[col]

    # Engineer aggregate features
    # Technical aptitude: math + science + computer
    features['technical_aptitude'] = (
        features.get('q24', 0) +
        features.get('q25', 0) +
        features.get('q28', 0)
    ) / 3

    # Scientific foundation: math + science + biology
    features['scientific_foundation'] = (
        features.get('q24', 0) +
        features.get('q25', 0) +
        features.get('q26', 0)
    ) / 3

    # Medical aptitude: biology + science
    features['medical_aptitude'] = (
        features.get('q26', 0) +
        features.get('q25', 0)
    ) / 2

    # Business aptitude: business + math
    features['business_aptitude'] = (
        features.get('q27', 0) +
        features.get('q24', 0)
    ) / 2

    # Creative aptitude: arts
    features['creative_aptitude'] = features.get('q29', 0)

    # Social aptitude: social sciences
    features['social_aptitude'] = features.get('q30', 0)

    # Analytical trait from behavioral questions
    # Questions that indicate analytical thinking: q4, q11, q13, q15, q18, q20
    analytical_questions = ['q4', 'q11', 'q13', 'q15', 'q18', 'q20']
    analytical_score = 0
    for q in analytical_questions:
        if q in features.columns:
            analytical_score += (features[q] == 0).astype(int)
    features['analytical_trait'] = analytical_score

    # Social/helping trait from behavioral questions
    # Questions that indicate social/helping: q6, q8, q13, q15, q17, q21, q22
    social_questions = ['q6', 'q8', 'q13', 'q15', 'q17', 'q21', 'q22']
    social_score = 0
    for q in social_questions:
        if q in features.columns:
            social_score += features[q].isin([1, 3]).astype(int)
    features['social_trait'] = social_score

    # Creative trait from behavioral questions
    # Questions that indicate creativity: q10, q14, q15, q17, q20, q21
    creative_questions = ['q10', 'q14', 'q15', 'q17', 'q20', 'q21']
    creative_score = 0
    for q in creative_questions:
        if q in features.columns:
            creative_score += (features[q] == 2).astype(int)
    features['creative_trait'] = creative_score

    # Technical/hands-on trait: q5, q9, q10, q14
    technical_questions = ['q5', 'q9', 'q10', 'q14']
    technical_score = 0
    for q in technical_questions:
        if q in features.columns:
            technical_score += features[q].isin([0, 2]).astype(int)
    features['technical_trait'] = technical_score

    # Management trait: q8, q12, q19, q23
    management_questions = ['q8', 'q12', 'q19', 'q23']
    management_score = 0
    for q in management_questions:
        if q in features.columns:
            management_score += features[q].isin([0, 2]).astype(int)
    features['management_trait'] = management_score

    return features

def preprocess_data(input_path, output_path=None):
    """
    Preprocess training data
    """
    print(f"Loading data from {input_path}...")
    df = pd.read_csv(input_path)

    print(f"Extracting features...")
    X = extract_features(df)

    print(f"Encoding target variable...")
    y = df['career']
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Save label encoder
    joblib.dump(le, 'ml/models/label_encoder.pkl')
    print(f"Saved label encoder to ml/models/label_encoder.pkl")

    # Save processed data
    if output_path:
        X['career_encoded'] = y_encoded
        X['career'] = y
        X.to_csv(output_path, index=False)
        print(f"Saved preprocessed data to {output_path}")

    print(f"\nFeature shape: {X.shape}")
    print(f"Classes: {list(le.classes_)}")

    return X, y_encoded, le

if __name__ == "__main__":
    X, y, le = preprocess_data(
        "ml/data/training_data.csv",
        "ml/data/processed_data.csv"
    )
    print("\nPreprocessing complete!")
