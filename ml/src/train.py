import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import cosine
import lightgbm as lgb
import joblib
import pickle
import os
from collections import defaultdict

# Create necessary directories
os.makedirs('../models', exist_ok=True)
os.makedirs('../../reports/eda', exist_ok=True)

print("Loading and preprocessing data...")

# Load the dataset
df = pd.read_csv('../data/student-scores.csv')
print(f"Loaded dataset with {len(df)} students")
print(f"Career distribution:\n{df['career_category'].value_counts()}")

# Create target mapping for consistent career categories
target_mapping = {
    'Engineering': 'Engineering',
    'Healthcare': 'Healthcare', 
    'Education': 'Education',
    'Arts': 'Arts',
    'Business': 'Business',
    'Law': 'Law',
    'IT/Data': 'IT/Data',
    'Science': 'Science'
}

# Save target mapping
target_df = pd.DataFrame(list(target_mapping.items()), columns=['original', 'mapped'])
target_df.to_csv('../../reports/target_mapping.csv', index=False)

df['career_cat'] = df['career_category'].map(target_mapping)
print(f"Mapped career categories: {df['career_cat'].unique()}")

# Define academic and behavioral features
academic_features = [
    'math_score', 'physics_score', 'chemistry_score', 'biology_score',
    'english_score', 'history_score', 'geography_score'
]

behavioral_features = [
    'weekly_self_study_hours', 'absence_days', 
    'extracurricular_activities', 'part_time_job'
]

all_features = academic_features + behavioral_features

# Extract features and target
X_academic = df[academic_features].copy()
X_behavioral = df[behavioral_features].copy()
X_all = df[all_features].copy()
y = df['career_cat'].copy()

print(f"Academic features shape: {X_academic.shape}")
print(f"Behavioral features shape: {X_behavioral.shape}")

# Invert absence_days so higher values are better (lower absence is better)
X_behavioral['absence_days'] = X_behavioral['absence_days'].max() - X_behavioral['absence_days']
X_all['absence_days'] = X_all['absence_days'].max() - X_all['absence_days']

# Generate EDA plots
plt.style.use('default')
fig, axes = plt.subplots(2, 2, figsize=(15, 10))

# Career distribution
axes[0,0].pie(df['career_cat'].value_counts().values, labels=df['career_cat'].value_counts().index, autopct='%1.1f%%')
axes[0,0].set_title('Career Category Distribution')

# Academic scores by career
df_melted = df[academic_features + ['career_cat']].melt(id_vars='career_cat', var_name='subject', value_name='score')
sns.boxplot(data=df_melted, x='career_cat', y='score', ax=axes[0,1])
axes[0,1].set_xticklabels(axes[0,1].get_xticklabels(), rotation=45)
axes[0,1].set_title('Academic Scores by Career')

# Study hours distribution
sns.histplot(data=df, x='weekly_self_study_hours', hue='career_cat', ax=axes[1,0], alpha=0.7)
axes[1,0].set_title('Study Hours Distribution by Career')

# Correlation heatmap of academic features
corr_matrix = X_academic.corr()
sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', ax=axes[1,1])
axes[1,1].set_title('Academic Features Correlation')

plt.tight_layout()
plt.savefig('../../reports/eda/exploratory_analysis.png', dpi=300, bbox_inches='tight')
plt.close()

# Train-test split (stratified)
X_academic_train, X_academic_test, X_behavioral_train, X_behavioral_test, X_all_train, X_all_test, y_train, y_test = train_test_split(
    X_academic, X_behavioral, X_all, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Train set size: {len(X_academic_train)}")
print(f"Test set size: {len(X_academic_test)}")

# Fit StandardScalers
print("Fitting scalers...")
scaler_academic = StandardScaler()
scaler_behavioral = StandardScaler()

X_academic_scaled_train = scaler_academic.fit_transform(X_academic_train)
X_behavioral_scaled_train = scaler_behavioral.fit_transform(X_behavioral_train)

X_academic_scaled_test = scaler_academic.transform(X_academic_test)
X_behavioral_scaled_test = scaler_behavioral.transform(X_behavioral_test)

# Save scalers
joblib.dump(scaler_academic, '../models/scalerA.joblib')
joblib.dump(scaler_behavioral, '../models/scalerB.joblib')

print("Scalers saved successfully")

# Compute centroids for each career category
print("Computing centroids...")
centroids = {}

# Get unique career categories
unique_careers = y_train.unique()

# Compute academic and behavioral centroids for each career
centroids_academic = {}
centroids_behavioral = {}

for career in unique_careers:
    # Get indices for this career in training set
    career_mask = y_train == career
    
    # Compute centroids (mean of standardized features)
    centroids_academic[career] = np.mean(X_academic_scaled_train[career_mask], axis=0)
    centroids_behavioral[career] = np.mean(X_behavioral_scaled_train[career_mask], axis=0)
    
    print(f"{career}: {np.sum(career_mask)} students")

centroids = {
    'academic': centroids_academic,
    'behavioral': centroids_behavioral,
    'feature_names': {
        'academic': academic_features,
        'behavioral': behavioral_features
    }
}

# Save centroids
with open('../models/centroids.pkl', 'wb') as f:
    pickle.dump(centroids, f)

print("Centroids saved successfully")

# Scoring function implementation
def calculate_career_scores(x_academic, x_behavioral, centroids, w_academic=0.6, w_behavioral=0.4):
    """
    Calculate A, B, S scores for all careers given student features
    """
    scores = {}
    
    for career in centroids['academic'].keys():
        # Cosine similarity with centroids
        cos_academic = 1 - cosine(x_academic, centroids['academic'][career])
        cos_behavioral = 1 - cosine(x_behavioral, centroids['behavioral'][career])
        
        # Map to 0-100 scale
        A = 100 * ((cos_academic + 1) / 2)
        B = 100 * ((cos_behavioral + 1) / 2)
        
        # Final weighted score
        S = w_academic * A + w_behavioral * B
        
        scores[career] = {
            'A': max(0, min(100, A)),  # Clamp to [0, 100]
            'B': max(0, min(100, B)),
            'S': max(0, min(100, S))
        }
    
    return scores

# Test the scoring system on train set
print("\nTesting scoring system...")
sample_scores = []

for i in range(min(50, len(X_academic_scaled_train))):
    x_a = X_academic_scaled_train[i]
    x_b = X_behavioral_scaled_train[i] 
    true_career = y_train.iloc[i]
    
    scores = calculate_career_scores(x_a, x_b, centroids)
    
    # Sort by S score
    sorted_scores = sorted(scores.items(), key=lambda x: x[1]['S'], reverse=True)
    predicted_career = sorted_scores[0][0]
    
    sample_scores.append({
        'true_career': true_career,
        'predicted_career': predicted_career,
        'correct': true_career == predicted_career,
        'true_score': scores[true_career]['S'],
        'pred_score': sorted_scores[0][1]['S']
    })

accuracy = np.mean([s['correct'] for s in sample_scores])
print(f"Sample accuracy on train set: {accuracy:.3f}")

# Optional: Train LightGBM classifier for hybrid scoring
print("\nTraining LightGBM classifier...")

# Prepare data for LightGBM
X_combined_train = np.hstack([X_academic_scaled_train, X_behavioral_scaled_train])
X_combined_test = np.hstack([X_academic_scaled_test, X_behavioral_scaled_test])

# Encode labels
from sklearn.preprocessing import LabelEncoder
le = LabelEncoder()
y_encoded_train = le.fit_transform(y_train)
y_encoded_test = le.transform(y_test)

# Train LightGBM
lgb_train = lgb.Dataset(X_combined_train, label=y_encoded_train)
lgb_test = lgb.Dataset(X_combined_test, label=y_encoded_test, reference=lgb_train)

params = {
    'objective': 'multiclass',
    'num_class': len(unique_careers),
    'metric': 'multi_logloss',
    'boosting_type': 'gbdt',
    'num_leaves': 31,
    'learning_rate': 0.05,
    'feature_fraction': 0.9,
    'verbose': -1,
    'random_state': 42
}

lgb_model = lgb.train(
    params,
    lgb_train,
    valid_sets=[lgb_test],
    num_boost_round=100,
    callbacks=[lgb.early_stopping(stopping_rounds=10), lgb.log_evaluation(0)]
)

# Save LightGBM model and label encoder
lgb_model.save_model('../models/lightgbm_classifier.txt')
joblib.dump(le, '../models/label_encoder.joblib')

# Evaluate LightGBM
lgb_pred_proba = lgb_model.predict(X_combined_test)
lgb_pred = np.argmax(lgb_pred_proba, axis=1)
lgb_accuracy = np.mean(lgb_pred == y_encoded_test)

print(f"LightGBM accuracy: {lgb_accuracy:.3f}")

# Generate training summary report
with open('../../reports/train_summary.md', 'w') as f:
    f.write("# ML Training Summary Report\n\n")
    f.write(f"## Dataset Overview\n")
    f.write(f"- Total students: {len(df)}\n")
    f.write(f"- Train set: {len(X_academic_train)} students\n")
    f.write(f"- Test set: {len(X_academic_test)} students\n")
    f.write(f"- Academic features: {len(academic_features)}\n")
    f.write(f"- Behavioral features: {len(behavioral_features)}\n\n")
    
    f.write("## Career Distribution\n")
    for career, count in df['career_cat'].value_counts().items():
        f.write(f"- {career}: {count} students ({count/len(df)*100:.1f}%)\n")
    
    f.write(f"\n## Model Performance\n")
    f.write(f"- Centroid-based accuracy (sample): {accuracy:.3f}\n")
    f.write(f"- LightGBM classifier accuracy: {lgb_accuracy:.3f}\n")
    
    f.write(f"\n## Feature Details\n")
    f.write(f"### Academic Features\n")
    for feat in academic_features:
        f.write(f"- {feat}\n")
    
    f.write(f"\n### Behavioral Features\n")
    for feat in behavioral_features:
        f.write(f"- {feat}\n")
    
    f.write(f"\n## Artifacts Generated\n")
    f.write(f"- scalerA.joblib: StandardScaler for academic features\n")
    f.write(f"- scalerB.joblib: StandardScaler for behavioral features\n") 
    f.write(f"- centroids.pkl: Career centroids for cosine similarity scoring\n")
    f.write(f"- lightgbm_classifier.txt: LightGBM multiclass model\n")
    f.write(f"- label_encoder.joblib: Label encoder for career categories\n")

print("\nTraining complete!")
print("Generated artifacts:")
print("- ../models/scalerA.joblib")
print("- ../models/scalerB.joblib") 
print("- ../models/centroids.pkl")
print("- ../models/lightgbm_classifier.txt")
print("- ../models/label_encoder.joblib")
print("- ../../reports/eda/exploratory_analysis.png")
print("- ../../reports/train_summary.md")
print("- ../../reports/target_mapping.csv")