import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Set random seed for reproducibility
np.random.seed(42)

# Career categories mapping
career_mapping = {
    'Engineering': ['Software Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Civil Engineer', 'Chemical Engineer'],
    'Healthcare': ['Doctor', 'Nurse', 'Pharmacist', 'Dentist', 'Therapist'],
    'Education': ['Teacher', 'Professor', 'Educator', 'Trainer', 'Counselor'], 
    'Arts': ['Artist', 'Designer', 'Writer', 'Musician', 'Photographer'],
    'Business': ['Manager', 'Analyst', 'Consultant', 'Entrepreneur', 'Marketing'],
    'Law': ['Lawyer', 'Judge', 'Legal Advisor', 'Paralegal', 'Attorney'],
    'IT/Data': ['Data Scientist', 'Web Developer', 'IT Support', 'DevOps', 'Cybersecurity'],
    'Science': ['Researcher', 'Biologist', 'Chemist', 'Physicist', 'Laboratory Technician']
}

# Generate 1000 student records
n_students = 1000
data = []

for i in range(n_students):
    # Select career first to create realistic correlations
    career_cat = np.random.choice(list(career_mapping.keys()))
    career = np.random.choice(career_mapping[career_cat])
    
    # Generate academic scores based on career (with some noise)
    if career_cat == 'Engineering':
        math_score = np.random.normal(85, 10)
        physics_score = np.random.normal(82, 12)
        chemistry_score = np.random.normal(78, 15)
        biology_score = np.random.normal(70, 18)
        english_score = np.random.normal(70, 15)
        history_score = np.random.normal(65, 20)
        geography_score = np.random.normal(68, 18)
        
    elif career_cat == 'Healthcare':
        math_score = np.random.normal(75, 12)
        physics_score = np.random.normal(70, 15)
        chemistry_score = np.random.normal(85, 8)
        biology_score = np.random.normal(88, 8)
        english_score = np.random.normal(78, 12)
        history_score = np.random.normal(70, 15)
        geography_score = np.random.normal(72, 15)
        
    elif career_cat == 'Arts':
        math_score = np.random.normal(60, 20)
        physics_score = np.random.normal(55, 20)
        chemistry_score = np.random.normal(58, 20)
        biology_score = np.random.normal(65, 18)
        english_score = np.random.normal(85, 10)
        history_score = np.random.normal(82, 12)
        geography_score = np.random.normal(78, 15)
        
    elif career_cat == 'Business':
        math_score = np.random.normal(78, 12)
        physics_score = np.random.normal(65, 18)
        chemistry_score = np.random.normal(62, 18)
        biology_score = np.random.normal(68, 15)
        english_score = np.random.normal(80, 10)
        history_score = np.random.normal(75, 15)
        geography_score = np.random.normal(78, 12)
        
    elif career_cat == 'IT/Data':
        math_score = np.random.normal(88, 8)
        physics_score = np.random.normal(75, 15)
        chemistry_score = np.random.normal(68, 18)
        biology_score = np.random.normal(65, 20)
        english_score = np.random.normal(72, 15)
        history_score = np.random.normal(60, 20)
        geography_score = np.random.normal(65, 18)
        
    elif career_cat == 'Science':
        math_score = np.random.normal(82, 10)
        physics_score = np.random.normal(88, 8)
        chemistry_score = np.random.normal(85, 10)
        biology_score = np.random.normal(87, 8)
        english_score = np.random.normal(70, 15)
        history_score = np.random.normal(68, 18)
        geography_score = np.random.normal(75, 15)
        
    elif career_cat == 'Education':
        math_score = np.random.normal(72, 15)
        physics_score = np.random.normal(68, 18)
        chemistry_score = np.random.normal(70, 18)
        biology_score = np.random.normal(75, 15)
        english_score = np.random.normal(88, 8)
        history_score = np.random.normal(85, 10)
        geography_score = np.random.normal(82, 12)
        
    else:  # Law
        math_score = np.random.normal(70, 18)
        physics_score = np.random.normal(60, 20)
        chemistry_score = np.random.normal(62, 20)
        biology_score = np.random.normal(65, 18)
        english_score = np.random.normal(92, 6)
        history_score = np.random.normal(90, 8)
        geography_score = np.random.normal(85, 10)
    
    # Clip scores to realistic ranges
    math_score = np.clip(math_score, 0, 100)
    physics_score = np.clip(physics_score, 0, 100)
    chemistry_score = np.clip(chemistry_score, 0, 100)
    biology_score = np.clip(biology_score, 0, 100)
    english_score = np.clip(english_score, 0, 100)
    history_score = np.clip(history_score, 0, 100)
    geography_score = np.clip(geography_score, 0, 100)
    
    # Generate behavioral features based on career patterns
    if career_cat in ['Engineering', 'IT/Data', 'Science']:
        weekly_self_study_hours = np.random.normal(25, 8)
        absence_days = np.random.poisson(3)  # Lower absence for STEM
        extracurricular_activities = np.random.choice([0, 1], p=[0.4, 0.6])
        part_time_job = np.random.choice([0, 1], p=[0.7, 0.3])  # Less likely to have part-time job
        
    elif career_cat in ['Business', 'Law']:
        weekly_self_study_hours = np.random.normal(20, 10)
        absence_days = np.random.poisson(5)
        extracurricular_activities = np.random.choice([0, 1], p=[0.2, 0.8])  # High extracurricular
        part_time_job = np.random.choice([0, 1], p=[0.4, 0.6])  # More likely to have job
        
    elif career_cat in ['Arts', 'Education']:
        weekly_self_study_hours = np.random.normal(18, 12)
        absence_days = np.random.poisson(6)
        extracurricular_activities = np.random.choice([0, 1], p=[0.1, 0.9])  # Very high extracurricular
        part_time_job = np.random.choice([0, 1], p=[0.5, 0.5])
        
    else:  # Healthcare
        weekly_self_study_hours = np.random.normal(30, 6)  # High study hours
        absence_days = np.random.poisson(2)  # Very low absence
        extracurricular_activities = np.random.choice([0, 1], p=[0.3, 0.7])
        part_time_job = np.random.choice([0, 1], p=[0.8, 0.2])  # Less likely to have job
    
    # Ensure realistic ranges
    weekly_self_study_hours = np.clip(weekly_self_study_hours, 0, 60)
    absence_days = np.clip(absence_days, 0, 30)
    
    # Create record
    record = {
        'student_id': f'S{i+1:04d}',
        'math_score': round(math_score, 1),
        'physics_score': round(physics_score, 1),
        'chemistry_score': round(chemistry_score, 1),
        'biology_score': round(biology_score, 1),
        'english_score': round(english_score, 1),
        'history_score': round(history_score, 1),
        'geography_score': round(geography_score, 1),
        'weekly_self_study_hours': round(weekly_self_study_hours, 1),
        'absence_days': int(absence_days),
        'extracurricular_activities': extracurricular_activities,
        'part_time_job': part_time_job,
        'career': career,
        'career_category': career_cat
    }
    
    data.append(record)

# Create DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv('../data/student-scores.csv', index=False)
print(f"Generated dataset with {len(df)} students")
print(f"Career distribution:\n{df['career_category'].value_counts()}")
print(f"\nSample records:")
print(df.head())
print(f"\nDataset saved to ../data/student-scores.csv")