"""
Dataset preprocessing and transformation
Converts existing student-scores.csv to expected ML format
"""
import pandas as pd
import numpy as np
import os

# Career mapping based on aspirations and scores
CAREER_MAPPINGS = {
    'Software Engineer': ('Software Engineering', ['Backend', 'Frontend', 'Mobile', 'DevOps', 'QA/Automation']),
    'Game Developer': ('Software Engineering', ['Frontend', 'Backend', 'Mobile']),
    'Doctor': ('Medicine & Health', ['Medicine', 'Biomed', 'Public Health']),
    'Scientist': ('Science & Research', ['Biology', 'Chemistry', 'Physics', 'Environmental']),
    'Teacher': ('Education & Training', ['K-12 Teacher', 'Higher Ed', 'Instructional Design']),
    'Business Owner': ('Entrepreneurship & Management', ['Founder', 'Operations Mgmt', 'Strategy/Consulting']),
    'Banker': ('Business & Finance', ['Corporate Finance', 'Investment/Trading', 'Operations']),
    'Accountant': ('Business & Finance', ['Accounting', 'Corporate Finance', 'Operations']),
    'Lawyer': ('Law & Public Policy', ['Corporate Law', 'Public Policy', 'Compliance']),
    'Government Officer': ('Law & Public Policy', ['Public Policy', 'Compliance', 'Criminology']),
    'Artist': ('Design & Media', ['Graphic/Brand', 'Illustration', '3D/CGI']),
    'Designer': ('Design & Media', ['Product/UI', 'Graphic/Brand', '3D/CGI']),
    'Writer': ('Marketing & Communications', ['Content/Copy', 'Brand', 'PR/Comms']),
    'Construction Engineer': ('Core Engineering', ['Civil', 'Mechanical', 'Industrial']),
    'Stock Investor': ('Business & Finance', ['Investment/Trading', 'Corporate Finance']),
}

def score_to_bin(score):
    """Convert numeric score to bin string"""
    if pd.isna(score) or score < 35:
        return "0–35"
    elif score < 55:
        return "35–55"
    elif score < 75:
        return "55–75"
    else:
        return "75–100"

def weekly_hours_to_daily(weekly_hours):
    """Convert weekly self-study to daily study hours estimate"""
    daily = weekly_hours / 7
    if daily < 3:
        return "0–3"
    elif daily < 6:
        return "3–6"
    elif daily < 10:
        return "6–10"
    else:
        return "10–15"

def weekly_hours_to_bin(weekly_hours):
    """Convert weekly hours to bin"""
    if weekly_hours < 3:
        return "0–3"
    elif weekly_hours < 6:
        return "3–6"
    elif weekly_hours < 10:
        return "6–10"
    else:
        return "10–15"

# Track distribution for balancing
career_counter = {}

def map_career(row):
    """Map career aspiration and scores to main career and sub with balancing"""
    global career_counter

    aspiration = row.get('career_aspiration', 'Unknown')
    career_cat = row.get('career_cat', 'Other')

    # Use career aspiration first
    if aspiration in CAREER_MAPPINGS:
        main, subs = CAREER_MAPPINGS[aspiration]
        # Pick sub based on score patterns
        if main == 'Software Engineering':
            if row['math_score'] >= 85 and row['physics_score'] >= 80:
                sub = 'Backend'
            elif row['english_score'] >= 80:
                sub = 'Frontend'
            else:
                sub = np.random.choice(subs)
        elif main == 'Medicine & Health':
            if row['biology_score'] >= 90 and row['chemistry_score'] >= 90:
                sub = 'Medicine'
            else:
                sub = np.random.choice(subs)
        elif main == 'Business & Finance':
            if row['math_score'] >= 85:
                sub = 'Investment/Trading'
            else:
                sub = 'Accounting'
        else:
            sub = np.random.choice(subs)

        career_counter[main] = career_counter.get(main, 0) + 1
        return main, sub

    # Fallback to career_cat
    if career_cat == 'IT/Data':
        career_counter['Data & AI'] = career_counter.get('Data & AI', 0) + 1
        if row['math_score'] >= 85:
            return 'Data & AI', 'Data Scientist'
        else:
            return 'Data & AI', 'Data Analyst'
    elif career_cat == 'Healthcare':
        career_counter['Medicine & Health'] = career_counter.get('Medicine & Health', 0) + 1
        return 'Medicine & Health', 'Nursing'
    elif career_cat == 'Education':
        career_counter['Education & Training'] = career_counter.get('Education & Training', 0) + 1
        return 'Education & Training', 'K-12 Teacher'
    elif career_cat == 'Engineering':
        # Split between Software and Core Engineering
        if row['math_score'] >= 75:
            career_counter['Software Engineering'] = career_counter.get('Software Engineering', 0) + 1
            return 'Software Engineering', 'Backend'
        else:
            career_counter['Core Engineering'] = career_counter.get('Core Engineering', 0) + 1
            return 'Core Engineering', 'Mechanical'
    elif career_cat == 'Business':
        career_counter['Business & Finance'] = career_counter.get('Business & Finance', 0) + 1
        return 'Business & Finance', 'Operations'
    else:
        # Other - use weighted distribution to balance underrepresented careers
        # Weight inversely to current count
        current_counts = career_counter.copy()
        target_careers = [
            ('Data & AI', 'Data Analyst'),
            ('Hospitality & Tourism', 'Event Mgmt'),
            ('Marketing & Communications', 'Digital Marketing'),
            ('Science & Research', 'Environmental'),
            ('Education & Training', 'Counseling'),
            ('Core Engineering', 'Civil'),
            ('Entrepreneurship & Management', 'Project Mgmt')
        ]

        # Give more weight to underrepresented careers
        weights = []
        for main, _ in target_careers:
            count = current_counts.get(main, 0)
            weight = 1.0 / (count + 1)  # Inverse weighting
            weights.append(weight)

        # Normalize weights
        total_weight = sum(weights)
        weights = [w / total_weight for w in weights]

        # Choose career based on weights
        idx = np.random.choice(len(target_careers), p=weights)
        main, sub = target_careers[idx]
        career_counter[main] = current_counts.get(main, 0) + 1
        return main, sub

def generate_behavioral_answers(row, main_career):
    """Generate synthetic but realistic behavioral answers"""

    # Q4: Problem solving
    if main_career in ['Software Engineering', 'Data & AI', 'Core Engineering']:
        q4 = "Break it down into smaller steps and solve systematically using logic"
    elif main_career in ['Medicine & Health', 'Science & Research']:
        q4 = "Research thoroughly and analyze all possible solutions carefully"
    elif main_career in ['Business & Finance', 'Entrepreneurship & Management']:
        q4 = "Consider practical implications and make data-driven decisions"
    elif main_career in ['Design & Media', 'Marketing & Communications']:
        q4 = "Think creatively and explore multiple innovative approaches"
    else:
        q4 = "Collaborate with others and gather diverse perspectives"

    # Q5: Design preference
    if main_career in ['Design & Media']:
        q5 = "I focus on visual aesthetics and creative design elements"
    elif main_career in ['Software Engineering', 'Data & AI']:
        q5 = "I prioritize functionality and user experience over pure aesthetics"
    else:
        q5 = "I balance both function and form in my designs"

    # Q6: Group role
    if row['teamwork'] >= 3:
        q6 = "Coordinate the team and assign roles to ensure smooth workflow"
    elif row['communication'] >= 3:
        q6 = "Facilitate communication between team members"
    else:
        q6 = "Focus on my individual tasks and contribute my expertise"

    # Q7: Helping others
    if main_career in ['Education & Training', 'Medicine & Health']:
        q7 = "Explain concepts patiently and provide resources for practice"
    elif row['communication'] >= 3:
        q7 = "Encourage them and help them find their own solutions"
    else:
        q7 = "Share what I know if asked but let them work independently"

    # Q8: Technology
    if main_career in ['Software Engineering', 'Data & AI', 'Core Engineering']:
        q8 = "I want to understand how things work at a deep technical level"
    elif main_career in ['Design & Media']:
        q8 = "I focus on designing products that users will love"
    else:
        q8 = "I use technology as a tool to achieve my goals"

    # Q9: Free time
    if main_career in ['Software Engineering', 'Data & AI', 'Science & Research']:
        q9 = "Experiment with new things and understand how they work"
    elif main_career in ['Design & Media', 'Marketing & Communications']:
        q9 = "Engage in creative projects like art, music, or design"
    else:
        q9 = "Spend time with friends and socialize"

    # Q10: Event planning
    if row['teamwork'] >= 3:
        q10 = "Coordinate with everyone and assign tasks efficiently"
    elif row['problem_solving'] >= 3:
        q10 = "Create a detailed checklist and manage the budget and schedule"
    else:
        q10 = "Help where needed but prefer not to lead"

    # Q11: Creative project
    if main_career in ['Design & Media']:
        q11 = "Design and create the core artistic elements"
    elif main_career in ['Marketing & Communications']:
        q11 = "Promote and market the project to reach more people"
    elif row['teamwork'] >= 3:
        q11 = "Lead the team and coordinate all aspects of the project"
    else:
        q11 = "Handle the technical or analytical aspects"

    return {
        'q4_choice': q4,
        'q5_choice': q5,
        'q6_choice': q6,
        'q7_choice': q7,
        'q8_choice': q8,
        'q9_choice': q9,
        'q10_choice': q10,
        'q11_choice': q11
    }

def generate_skills(row, main_career):
    """Generate realistic skill patterns"""
    skills = {
        'skill_problem_solving': 1 if row['problem_solving'] >= 3 else 0,
        'skill_teamwork': 1 if row['teamwork'] >= 3 else 0,
        'skill_communication': 1 if row['communication'] >= 3 else 0,
        'skill_growth_mindset': 1 if row['weekly_self_study_hours'] >= 20 else 0,
        'skill_multitasking': 1 if row['extracurricular_activities'] else 0,
        'skill_time_management': 1 if row['absence_days'] <= 3 else 0,
        'skill_digital_literacy': 1 if main_career in ['Software Engineering', 'Data & AI', 'IT/Data'] else 0,
        'skill_leadership': 1 if row['teamwork'] >= 3 and row['problem_solving'] >= 3 else 0,
        'skill_critical_thinking': 1 if row['problem_solving'] >= 3 else 0,
        'skill_adaptability': 1 if row['weekly_self_study_hours'] >= 15 else 0,
        'skill_creativity': 1 if main_career in ['Design & Media', 'Marketing & Communications'] else 0,
        'skill_decision_making': 1 if row['problem_solving'] >= 3 else 0
    }
    return skills

def preprocess_dataset():
    """Main preprocessing function"""
    print("=" * 60)
    print("Dataset Preprocessing Pipeline")
    print("=" * 60)

    # Load original dataset
    print("\n[1/5] Loading original dataset...")
    df = pd.read_csv('ml/data/student-scores.csv')
    print(f"   Loaded {len(df)} rows")
    print(f"   Columns: {list(df.columns)}")

    # Create new dataframe with expected format
    print("\n[2/5] Transforming to expected format...")
    transformed = []

    for idx, row in df.iterrows():
        # Map careers
        main_career, sub_career = map_career(row)

        # Bin academic scores
        math_bin = score_to_bin(row['math_score'])
        physics_bin = score_to_bin(row['physics_score'])
        biology_bin = score_to_bin(row['biology_score'])
        chemistry_bin = score_to_bin(row['chemistry_score'])

        # Map history to business, english to arts, geography to psychology
        business_bin = score_to_bin(row.get('history_score', 50))
        arts_bin = score_to_bin(row.get('english_score', 50))
        psychology_bin = score_to_bin(row.get('geography_score', 50))

        # Economics as average of math and business scores
        econ_score = (row['math_score'] + row.get('history_score', 50)) / 2
        economics_bin = score_to_bin(econ_score)

        # Computing based on math and problem-solving
        computing_score = row['math_score'] if main_career in ['Software Engineering', 'Data & AI'] else row['math_score'] * 0.7
        computing_bin = score_to_bin(computing_score)

        # Study habits
        study_hours_day_bin = weekly_hours_to_daily(row['weekly_self_study_hours'])
        study_hours_week_bin = weekly_hours_to_bin(row['weekly_self_study_hours'])

        # Behavioral answers
        behavioral = generate_behavioral_answers(row, main_career)

        # Skills
        skills = generate_skills(row, main_career)

        # Career intent text
        career_intent = row.get('career_aspiration', 'Unknown')

        # Build row
        new_row = {
            'label_main': main_career,
            'label_sub': sub_career,
            'math_score_bin': math_bin,
            'physics_score_bin': physics_bin,
            'biology_score_bin': biology_bin,
            'chemistry_score_bin': chemistry_bin,
            'business_score_bin': business_bin,
            'economics_score_bin': economics_bin,
            'arts_score_bin': arts_bin,
            'psychology_score_bin': psychology_bin,
            'computing_score_bin': computing_bin,
            'study_hours_per_day_bin': study_hours_day_bin,
            'self_study_hours_per_week_bin': study_hours_week_bin,
            'extra_classes': 'Yes' if row.get('part_time_job', False) else 'No',
            'extracurriculars': 'Yes' if row.get('extracurricular_activities', False) else 'No',
            **behavioral,
            **skills,
            'career_intent_text': career_intent
        }
        transformed.append(new_row)

    df_transformed = pd.DataFrame(transformed)

    # Print statistics
    print("\n[3/5] Dataset statistics:")
    print(f"   Total samples: {len(df_transformed)}")
    print(f"   Main careers distribution:")
    for career, count in df_transformed['label_main'].value_counts().items():
        print(f"      {career}: {count} ({count/len(df_transformed)*100:.1f}%)")

    # Check for bias
    print("\n[4/5] Bias analysis:")

    # Check label distribution
    career_counts = df_transformed['label_main'].value_counts()
    imbalance_ratio = career_counts.max() / career_counts.min()
    print(f"   Class imbalance ratio: {imbalance_ratio:.2f}x")

    if imbalance_ratio > 5:
        print(f"   WARNING: High class imbalance detected!")
        print(f"   Consider: SMOTE oversampling or class weights")

    # Check feature diversity
    computing_high = (df_transformed['computing_score_bin'].isin(['55–75', '75–100'])).sum()
    print(f"   Computing scores >=55: {computing_high} ({computing_high/len(df_transformed)*100:.1f}%)")

    # Save transformed dataset
    print("\n[5/5] Saving transformed dataset...")
    output_path = 'ml/data/student-scores-transformed.csv'
    df_transformed.to_csv(output_path, index=False)
    print(f"   Saved to: {output_path}")

    # Also backup original
    backup_path = 'ml/data/student-scores-original-backup.csv'
    if not os.path.exists(backup_path):
        df.to_csv(backup_path, index=False)
        print(f"   Backed up original to: {backup_path}")

    print("\n" + "=" * 60)
    print("Preprocessing complete!")
    print("=" * 60)

    return df_transformed

if __name__ == "__main__":
    preprocess_dataset()
