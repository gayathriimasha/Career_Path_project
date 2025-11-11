"""
Test the ML service with sample requests
"""
import requests
import json

# Test payload - simulating a STEM-focused student
test_payload = {
    # Academic scores
    "math_score_bin": "75–100",
    "physics_score_bin": "75–100",
    "biology_score_bin": "55–75",
    "chemistry_score_bin": "55–75",
    "business_score_bin": "35–55",
    "economics_score_bin": "35–55",
    "arts_score_bin": "35–55",
    "psychology_score_bin": "55–75",
    "computing_score_bin": "75–100",

    # Study habits
    "study_hours_per_day_bin": "6–10",
    "self_study_hours_per_week_bin": "6–10",
    "extra_classes": "Yes",
    "extracurriculars": "Yes",

    # Behavioral questions (STEM-focused)
    "q4_choice": "Break it down into smaller steps and solve systematically using logic",
    "q5_choice": "I prioritize functionality and user experience over pure aesthetics",
    "q6_choice": "Focus on my individual tasks and contribute my expertise",
    "q7_choice": "Explain concepts patiently and provide resources for practice",
    "q8_choice": "I want to understand how things work at a deep technical level",
    "q9_choice": "Experiment with new things and understand how they work",
    "q10_choice": "Create a detailed checklist and manage the budget and schedule",
    "q11_choice": "Handle the technical or analytical aspects",

    # Skills
    "skill_problem_solving": 1,
    "skill_teamwork": 1,
    "skill_growth_mindset": 1,
    "skill_multitasking": 1,
    "skill_communication": 1,
    "skill_time_management": 1,
    "skill_digital_literacy": 1,
    "skill_leadership": 0,
    "skill_critical_thinking": 1,
    "skill_adaptability": 1,
    "skill_creativity": 0,
    "skill_decision_making": 1,

    # Career intent
    "career_intent_text": "Software Engineer"
}

def test_service():
    print("=" * 70)
    print("ML Service End-to-End Test")
    print("=" * 70)

    # Test 1: Health check
    print("\n[Test 1/3] Health check...")
    try:
        response = requests.get("http://127.0.0.1:8001/health", timeout=5)
        if response.status_code == 200:
            print("   [PASS] Service is healthy")
            print(f"   Response: {response.json()}")
        else:
            print(f"   [FAIL] Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"   [FAIL] Could not connect to service: {e}")
        return False

    # Test 2: STEM student prediction
    print("\n[Test 2/3] STEM student prediction...")
    try:
        response = requests.post(
            "http://127.0.0.1:8001/score",
            json=test_payload,
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print("   [PASS] Prediction successful")
            print(f"\n   Top Career: {result['top_career']['main']} - {result['top_career']['sub']}")
            print(f"   Confidence: {'Low' if result['low_confidence'] else 'High'}")
            print(f"\n   Top-3 Matches:")
            for i, career in enumerate(result['topN'][:3], 1):
                print(f"      {i}. {career['career']}: {career['S_final']:.1f}")

            print(f"\n   Reasons:")
            for reason in result['reasons']:
                print(f"      - {reason}")

            if result.get('counterfactuals'):
                print(f"\n   Counterfactuals: {len(result['counterfactuals'])} alternatives")

            # Verify it's a tech career
            top_career = result['top_career']['main']
            expected_careers = ['Software Engineering', 'Data & AI', 'Core Engineering']
            if top_career in expected_careers:
                print(f"\n   [PASS] Correctly predicted a STEM career: {top_career}")
            else:
                print(f"\n   [WARN] Expected STEM career, got: {top_career}")

        else:
            print(f"   [FAIL] Prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False

    except Exception as e:
        print(f"   [FAIL] Prediction request failed: {e}")
        return False

    # Test 3: Non-STEM student prediction
    print("\n[Test 3/3] Non-STEM student prediction...")
    non_stem_payload = test_payload.copy()
    non_stem_payload.update({
        "math_score_bin": "35–55",
        "physics_score_bin": "35–55",
        "computing_score_bin": "35–55",
        "biology_score_bin": "75–100",
        "chemistry_score_bin": "75–100",
        "arts_score_bin": "75–100",
        "q4_choice": "Think creatively and explore multiple innovative approaches",
        "q8_choice": "I focus on designing products that users will love",
        "q9_choice": "Engage in creative projects like art, music, or design",
        "skill_digital_literacy": 0,
        "skill_creativity": 1,
        "career_intent_text": "Designer"
    })

    try:
        response = requests.post(
            "http://127.0.0.1:8001/score",
            json=non_stem_payload,
            timeout=10
        )

        if response.status_code == 200:
            result = response.json()
            print("   [PASS] Prediction successful")
            top_career = result['top_career']['main']
            print(f"   Top Career: {top_career} - {result['top_career']['sub']}")

            # Verify it's NOT a pure tech career
            stem_careers = ['Software Engineering', 'Data & AI']
            if top_career not in stem_careers:
                print(f"   [PASS] Correctly avoided pure STEM careers for non-STEM profile")
            else:
                print(f"   [WARN] Got STEM career for non-STEM profile: {top_career}")

        else:
            print(f"   [FAIL] Prediction failed: {response.status_code}")
            return False

    except Exception as e:
        print(f"   [FAIL] Prediction request failed: {e}")
        return False

    print("\n" + "=" * 70)
    print("All tests completed successfully!")
    print("=" * 70)
    return True

if __name__ == "__main__":
    success = test_service()
    exit(0 if success else 1)
