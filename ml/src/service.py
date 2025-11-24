from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import joblib
import numpy as np
import pandas as pd
import json
from pathlib import Path

app = FastAPI(title="Career Prediction Service", version="2.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model variables
model = None
label_encoder = None
feature_names = None
model_metadata = None

def load_models():
    """Load trained models and metadata"""
    global model, label_encoder, feature_names, model_metadata

    try:
        model_path = Path("../models/career_model.pkl")
        encoder_path = Path("../models/label_encoder.pkl")
        features_path = Path("../models/feature_names.json")
        metadata_path = Path("../models/model_metadata.json")

        model = joblib.load(model_path)
        label_encoder = joblib.load(encoder_path)

        with open(features_path, 'r') as f:
            feature_names = json.load(f)

        with open(metadata_path, 'r') as f:
            model_metadata = json.load(f)

        print(f"[OK] Model loaded successfully")
        print(f"[OK] Model accuracy: {model_metadata['accuracy']*100:.2f}%")
        print(f"[OK] Classes: {len(label_encoder.classes_)}")

    except Exception as e:
        print(f"Error loading models: {e}")
        raise

@app.on_event("startup")
async def startup_event():
    """Load models on startup"""
    load_models()

class Answer(BaseModel):
    questionId: int
    value: str

class PredictionRequest(BaseModel):
    answers: List[Answer]

class CareerPrediction(BaseModel):
    career: str
    confidence: float
    subcareers: List[str]

class PredictionResponse(BaseModel):
    predictions: List[CareerPrediction]
    metadata: Dict

def extract_features_from_answers(answers: List[Answer]) -> pd.DataFrame:
    """
    Convert raw answers to feature vector matching training format
    """
    # Initialize features dictionary
    features = {}

    # Create answer lookup
    answer_map = {ans.questionId: ans.value for ans in answers}

    # Academic score mapping
    score_mapping = {
        "0 – 35": 0,
        "35 – 55": 1,
        "55 – 75": 2,
        "75 – 100": 3
    }

    # Process behavioral questions (4-23)
    for q_id in range(4, 24):
        if q_id in answer_map:
            value = answer_map[q_id]
            # For behavioral questions, map option to index (0-3)
            # We need to determine which option index it is
            features[f"q{q_id}"] = parse_behavioral_answer(q_id, value)
        else:
            features[f"q{q_id}"] = 0

    # Process academic questions (24-30)
    for q_id in range(24, 31):
        if q_id in answer_map:
            value = answer_map[q_id]
            features[f"q{q_id}"] = score_mapping.get(value, 0)
        else:
            features[f"q{q_id}"] = 0

    # Engineer aggregate features
    features['technical_aptitude'] = (
        features.get('q24', 0) +
        features.get('q25', 0) +
        features.get('q28', 0)
    ) / 3

    features['scientific_foundation'] = (
        features.get('q24', 0) +
        features.get('q25', 0) +
        features.get('q26', 0)
    ) / 3

    features['medical_aptitude'] = (
        features.get('q26', 0) +
        features.get('q25', 0)
    ) / 2

    features['business_aptitude'] = (
        features.get('q27', 0) +
        features.get('q24', 0)
    ) / 2

    features['creative_aptitude'] = features.get('q29', 0)

    features['social_aptitude'] = features.get('q30', 0)

    # Behavioral traits
    analytical_questions = ['q4', 'q11', 'q13', 'q15', 'q18', 'q20']
    features['analytical_trait'] = sum(
        features.get(q, 0) * (1 if features.get(q, 0) == 0 else 0)
        for q in analytical_questions
    )

    social_questions = ['q6', 'q8', 'q13', 'q15', 'q17', 'q21', 'q22']
    features['social_trait'] = sum(
        features.get(q, 0) * (1 if features.get(q, 0) in [1, 3] else 0)
        for q in social_questions
    )

    creative_questions = ['q10', 'q14', 'q15', 'q17', 'q20', 'q21']
    features['creative_trait'] = sum(
        features.get(q, 0) * (1 if features.get(q, 0) == 2 else 0)
        for q in creative_questions
    )

    technical_questions = ['q5', 'q9', 'q10', 'q14']
    features['technical_trait'] = sum(
        features.get(q, 0) * (1 if features.get(q, 0) in [0, 2] else 0)
        for q in technical_questions
    )

    management_questions = ['q8', 'q12', 'q19', 'q23']
    features['management_trait'] = sum(
        features.get(q, 0) * (1 if features.get(q, 0) in [0, 2] else 0)
        for q in management_questions
    )

    # Convert to DataFrame with correct column order
    df = pd.DataFrame([features])
    df = df[feature_names]  # Ensure correct column order

    return df

def parse_behavioral_answer(question_id: int, answer_text: str) -> int:
    """
    Parse behavioral answer text to option index (0-3)
    """
    # Define answer mappings for each question
    # This maps the answer text to its index
    question_options = {
        4: [
            "Break it down into logical steps and analyze systematically",
            "Research similar cases and apply proven solutions",
            "Brainstorm creative alternatives and experiment",
            "Discuss with others to understand different perspectives"
        ],
        5: [
            "Laboratory or research facility with controlled environment",
            "Hospital or clinic helping people directly",
            "Workshop or site building tangible solutions",
            "Office managing operations and people"
        ],
        6: [
            "Analyze the root cause and suggest practical solutions",
            "Offer emotional support and listen to their concerns",
            "Share your experience and teach them skills",
            "Connect them with resources or people who can help"
        ],
        7: [
            "Study theory first, then practice systematically",
            "Jump in and learn by doing",
            "Watch demonstrations and replicate step-by-step",
            "Combine multiple resources and experiment"
        ],
        8: [
            "Take charge and coordinate the response",
            "Stay calm and provide immediate practical help",
            "Follow protocols and ensure safety procedures",
            "Support others emotionally and maintain morale"
        ],
        9: [
            "I love coding, building systems, and troubleshooting technical issues",
            "I use it as a tool to enhance my work efficiency",
            "I'm comfortable with standard applications but not programming",
            "I prefer hands-on physical work over digital tools"
        ],
        10: [
            "Discovering something new through research and experimentation",
            "Designing and building a physical structure or product",
            "Creating art, media, or visual experiences",
            "Improving how organizations or communities function"
        ],
        11: [
            "Data, statistics, and measurable evidence",
            "Expert consultation and established best practices",
            "Intuition and past experience",
            "Consensus and input from affected people"
        ],
        12: [
            "High - I find structure and routine comforting",
            "Moderate - I can handle routine but need some variety",
            "Low - I need constant change and new challenges",
            "I can optimize routine tasks to make them efficient"
        ],
        13: [
            "Focus on facts, logic, and accurate information",
            "Listen actively and show empathy for feelings",
            "Share stories and use vivid descriptions",
            "Guide discussion toward practical outcomes"
        ],
        14: [
            "I prefer mental challenges and intellectual work",
            "I enjoy balanced combination of both",
            "I thrive on physical activity and hands-on tasks",
            "I prefer physical work but with planning elements"
        ],
        15: [
            "Scientific accuracy and quality of results",
            "Positive impact on people's lives",
            "Innovation and originality of solution",
            "Efficiency and profitability achieved"
        ],
        16: [
            "Low - I need clear guidelines and procedures",
            "Moderate - I can adapt but prefer some structure",
            "High - I thrive in ambiguous and changing situations",
            "I can handle uncertainty when there's a clear goal"
        ],
        17: [
            "Intellectual curiosity and advancing knowledge",
            "Saving lives and improving health",
            "Financial success and business growth",
            "Self-expression and creative freedom"
        ],
        18: [
            "Analyze it objectively to improve quality",
            "Feel concerned about others' wellbeing and perceptions",
            "Defend my methods if I believe they're correct",
            "Use it as learning opportunity for growth"
        ],
        19: [
            "Lead by expertise and technical knowledge",
            "Lead through vision and inspiration",
            "Lead by organizing and delegating efficiently",
            "Lead through collaboration and team empowerment"
        ],
        20: [
            "Precision and accuracy of every detail",
            "Positive outcome for people involved",
            "Innovative or aesthetic quality of result",
            "Meeting deadlines and budget constraints"
        ],
        21: [
            "Reading, research, or intellectual hobbies",
            "Volunteering or helping in your community",
            "Creating art, music, or other creative projects",
            "Outdoor activities, sports, or practical hobbies"
        ],
        22: [
            "Logical analysis of outcomes and consequences",
            "Compassion and minimizing harm to others",
            "Following established rules and regulations",
            "Balancing multiple stakeholder interests"
        ],
        23: [
            "Thrive under pressure and deliver best work",
            "Stay focused but feel stressed internally",
            "Need careful planning to avoid last-minute pressure",
            "Perform well but prefer more time for quality"
        ]
    }

    if question_id in question_options:
        options = question_options[question_id]
        if answer_text in options:
            return options.index(answer_text)

    return 0  # Default

# Career-specific subcareers
SUBCAREERS = {
    "Science": ["Research Scientist", "Data Scientist", "Laboratory Analyst"],
    "Medical": ["Physician", "Surgeon", "Medical Researcher"],
    "Engineering": ["Software Engineer", "Mechanical Engineer", "Civil Engineer"],
    "Hospitality": ["Hotel Manager", "Event Planner", "Restaurant Manager"],
    "Business & Finance": ["Financial Analyst", "Investment Banker", "Business Consultant"],
    "Information Technology": ["Full Stack Developer", "Cybersecurity Analyst", "Cloud Architect"],
    "Agriculture": ["Agricultural Scientist", "Farm Manager", "Sustainable Agriculture Specialist"],
    "Creative": ["Graphic Designer", "Content Creator", "UX/UI Designer"],
    "Architecture": ["Licensed Architect", "Urban Planner", "Landscape Architect"],
    "Community & Social Services": ["Social Worker", "Counselor", "Community Organizer"],
    "Education": ["Teacher", "Educational Administrator", "Curriculum Developer"]
}

@app.post("/predict", response_model=PredictionResponse)
async def predict_career(request: PredictionRequest):
    """
    Predict top 3 career paths based on user answers
    """
    try:
        if model is None or label_encoder is None:
            raise HTTPException(status_code=503, detail="Model not loaded")

        # Extract features
        X = extract_features_from_answers(request.answers)

        # Get predictions
        probabilities = model.predict_proba(X)[0]

        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[::-1][:3]

        predictions = []
        for idx in top_indices:
            career = label_encoder.classes_[idx]
            confidence = float(probabilities[idx])

            predictions.append(CareerPrediction(
                career=career,
                confidence=round(confidence, 4),
                subcareers=SUBCAREERS.get(career, [])
            ))

        return PredictionResponse(
            predictions=predictions,
            metadata={
                "model_version": model_metadata.get("version", "2.0"),
                "model_accuracy": model_metadata.get("accuracy", 0),
                "model_type": "XGBoost"
            }
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "version": "2.0"
    }

@app.get("/model/info")
async def model_info():
    """Get model information"""
    if model_metadata is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    return model_metadata

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
