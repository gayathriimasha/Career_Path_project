import requests
import json

payload = {
    "math_score_bin": "75–100",
    "physics_score_bin": "75–100",
    "biology_score_bin": "35–55",
    "chemistry_score_bin": "35–55",
    "business_score_bin": "35–55",
    "economics_score_bin": "35–55",
    "arts_score_bin": "35–55",
    "psychology_score_bin": "35–55",
    "computing_score_bin": "55–75",
    "study_hours_per_day_bin": "6–10",
    "self_study_hours_per_week_bin": "6–10",
    "extra_classes": "Yes",
    "extracurriculars": "Yes",
    "q4_choice": "I break problems down logically",
    "q5_choice": "I prefer functional design",
    "q6_choice": "I like to lead and coordinate",
    "q7_choice": "I explain step by step",
    "q8_choice": "I want to understand how it works",
    "q9_choice": "I like building things",
    "q10_choice": "I create checklists and budgets",
    "q11_choice": "I design and create",
    "skill_problem_solving": 1,
    "skill_teamwork": 1,
    "skill_growth_mindset": 0,
    "skill_multitasking": 0,
    "skill_communication": 0,
    "skill_time_management": 0,
    "skill_digital_literacy": 1,
    "skill_leadership": 0,
    "skill_critical_thinking": 1,
    "skill_adaptability": 0,
    "skill_creativity": 0,
    "skill_decision_making": 0,
    "career_intent_text": "I want to be a software engineer"
}

try:
    response = requests.post("http://localhost:8000/score", json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
