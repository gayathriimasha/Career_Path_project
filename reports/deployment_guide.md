# Career Path Predictor - ML Pipeline Deployment Guide

## Overview
This guide provides step-by-step instructions for running the complete Career Path Predictor system with ML-powered career recommendations.

## Prerequisites
- Node.js (v14 or higher)
- Python 3.11 or higher
- MongoDB (local or Atlas)

## Architecture Overview
```
Frontend (React/TypeScript) → Backend (Node.js/Express) → ML Service (Python/FastAPI)
                             ↓
                          MongoDB
```

## Step 1: Install Dependencies

### Backend Dependencies
```bash
cd backend
npm install
```

### Python ML Dependencies  
```bash
cd ml
pip install -r requirements.txt
```

### Frontend Dependencies
```bash
# From project root
npm install
```

## Step 2: Environment Setup

Create `.env` file in the `backend/` directory:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

## Step 3: Start Services

### 1. Start MongoDB
Ensure MongoDB is running (local or cloud Atlas).

### 2. Start ML Service
```bash
cd ml/src
python -m uvicorn service:app --host 127.0.0.1 --port 8001 --reload
```

Verify ML service is running:
```bash
curl http://127.0.0.1:8001/health
```

Expected response:
```json
{
  "status": "healthy",
  "models_loaded": true,
  "available_careers": ["Engineering", "Healthcare", "Science", ...]
}
```

### 3. Start Backend API
```bash
cd backend
npm start
```

Verify backend is running:
```bash
curl http://localhost:5000/api/ml/health
```

### 4. Start Frontend
```bash
# From project root
npm run dev
```

## Step 4: Verify End-to-End Functionality

### 1. Complete Assessment Flow
1. Open browser to frontend URL (typically http://localhost:5173)
2. Navigate to `/questionnaire`
3. Complete all 25 questions
4. Submit assessment
5. View results page with ML-powered career recommendations

### 2. Test ML API Directly
```bash
# Test with sample features
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "features": {
      "math_score": 85.0,
      "physics_score": 78.0,
      "chemistry_score": 72.0,
      "biology_score": 80.0,
      "english_score": 75.0,
      "history_score": 70.0,
      "geography_score": 73.0,
      "weekly_self_study_hours": 20.0,
      "absence_days": 5.0,
      "extracurricular_activities": 1,
      "part_time_job": 0
    }
  }'
```

## Architecture Details

### ML Pipeline Components
1. **Data Generation**: Synthetic dataset with 1000 student records across 8 career categories
2. **Feature Engineering**: Maps 25-question assessment to 11 ML features
3. **Training Pipeline**: Standardized centroids + optional LightGBM classifier
4. **Scoring Algorithm**: Cosine similarity with confidence intervals
5. **API Service**: FastAPI with Pydantic validation

### Feature Mapping
| Assessment Questions | ML Features |
|---------------------|-------------|
| Q12-19 (Academic scores) | `math_score`, `physics_score`, etc. |
| Q20-21 (Study habits) | `weekly_self_study_hours` |
| Q22-23 (Activities) | `extracurricular_activities` |
| Q4-11 (Behavioral) | Derived behavioral features |

### Scoring Method
- **Academic Score (A)**: Cosine similarity with academic centroid (0-100%)
- **Behavioral Score (B)**: Cosine similarity with behavioral centroid (0-100%)  
- **Final Score (S)**: Weighted combination: `S = 0.6*A + 0.4*B`
- **Confidence**: Bootstrap confidence intervals + score gap analysis

## File Structure
```
project/
├── ml/                          # Python ML pipeline
│   ├── data/student-scores.csv  # Training dataset
│   ├── models/                  # Trained model artifacts
│   └── src/
│       ├── train.py             # Training pipeline
│       └── service.py           # FastAPI service
├── backend/                     # Node.js API server
│   ├── mlbridge/               # ML integration layer
│   ├── routes/ml.js            # ML API endpoints
│   └── models/                 # MongoDB schemas
├── src/                        # React frontend
│   └── pages/ResultsPage.tsx   # Enhanced results display
└── reports/                    # Documentation & analysis
    ├── api_examples.md         # API testing guide
    ├── train_summary.md        # ML training report
    └── eda/                    # Exploratory data analysis
```

## Database Schema

### AssessmentResult (Existing)
```javascript
{
  _id: ObjectId,
  userId: String,
  userEmail: String,
  userName: String,
  answers: [{ questionId: Number, value: Mixed }],
  scores: { mathematics: Number, physics: Number, ... },
  traits: { problemSolving: Number, leadership: Number, ... },
  timestamps: true
}
```

### PredictionResult (New)
```javascript
{
  _id: ObjectId,
  userId: String,
  assessmentId: ObjectId,
  topCareer: String,
  topN: [{ career: String, A: Number, B: Number, S: Number, ci: [Number] }],
  reasons: [String],
  lowConfidence: Boolean,
  timestamps: true
}
```

## Performance Characteristics
- **ML Training**: ~30 seconds for 1000 student dataset
- **Prediction Latency**: 2-5 seconds (including confidence intervals)
- **Memory Usage**: ~200MB for ML service
- **Model Size**: ~5MB total artifacts

## Career Categories
1. **Engineering** - High math/physics focus
2. **Healthcare** - High biology/chemistry + study commitment  
3. **Science** - Balanced STEM with research orientation
4. **IT/Data** - Strong math + moderate technical skills
5. **Arts** - High language/creative subjects
6. **Business** - Balanced academics + leadership traits
7. **Law** - Very high language + analytical skills
8. **Education** - Strong communication + broad knowledge

## Troubleshooting

### ML Service Issues
```bash
# Check if Python dependencies are installed
cd ml && pip list | grep -E "fastapi|scikit-learn|pandas"

# Verify model artifacts exist
ls ml/models/

# Check service logs
cd ml/src && python service.py
```

### Backend API Issues  
```bash
# Check MongoDB connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('MongoDB OK')).catch(console.error)"

# Test feature mapping
cd backend && node tests/featureMapping.test.js
```

### Frontend Issues
```bash
# Check API connectivity from browser console
fetch('http://localhost:5000/api/ml/health').then(r => r.json()).then(console.log)
```

## Production Deployment Notes
1. **ML Service**: Deploy with process manager (PM2, supervisor)
2. **Security**: Add API authentication and rate limiting
3. **Scaling**: Use Redis for caching ML predictions
4. **Monitoring**: Add health check endpoints and logging
5. **Model Updates**: Implement versioned model deployment

## Next Steps
1. **Model Improvement**: Collect real student data for better accuracy
2. **Feature Enhancement**: Add more behavioral and contextual features  
3. **Skill Roadmaps**: Integrate with learning platforms for personalized paths
4. **A/B Testing**: Compare prediction accuracy across different algorithms
5. **Real-time Updates**: Stream new assessment data for continuous learning