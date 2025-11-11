# ML Training Summary Report

## Dataset Overview
- Total students: 1000
- Train set: 800 students
- Test set: 200 students
- Academic features: 7
- Behavioral features: 4

## Career Distribution
- Engineering: 149 students (14.9%)
- Healthcare: 147 students (14.7%)
- Science: 128 students (12.8%)
- IT/Data: 125 students (12.5%)
- Arts: 121 students (12.1%)
- Business: 120 students (12.0%)
- Law: 116 students (11.6%)
- Education: 94 students (9.4%)

## Model Performance
- Centroid-based accuracy (sample): 0.600
- LightGBM classifier accuracy: 0.520

## Feature Details
### Academic Features
- math_score
- physics_score
- chemistry_score
- biology_score
- english_score
- history_score
- geography_score

### Behavioral Features
- weekly_self_study_hours
- absence_days
- extracurricular_activities
- part_time_job

## Artifacts Generated
- scalerA.joblib: StandardScaler for academic features
- scalerB.joblib: StandardScaler for behavioral features
- centroids.pkl: Career centroids for cosine similarity scoring
- lightgbm_classifier.txt: LightGBM multiclass model
- label_encoder.joblib: Label encoder for career categories
