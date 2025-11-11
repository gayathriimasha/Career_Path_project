# ML API Examples & Testing Guide

## Overview
This document provides examples and test cases for the Career Prediction ML API endpoints.

## Base URL
```
http://localhost:5000/api/ml
```

## Endpoints

### 1. Health Check
Check if the ML service is running and healthy.

**Request:**
```bash
curl -X GET http://localhost:5000/api/ml/health
```

**Response (Success):**
```json
{
  "mlService": {
    "status": "healthy",
    "models_loaded": true,
    "available_careers": ["Engineering", "Healthcare", "Science", "IT/Data", "Arts", "Business", "Law", "Education"]
  },
  "status": "healthy",
  "timestamp": "2024-11-11T12:00:00.000Z"
}
```

**Response (ML Service Down):**
```json
{
  "mlService": null,
  "status": "unhealthy", 
  "error": "ML Service unavailable: connect ECONNREFUSED 127.0.0.1:8001",
  "timestamp": "2024-11-11T12:00:00.000Z"
}
```

### 2. Career Prediction
Generate career recommendations based on assessment data.

**Request by Assessment ID:**
```bash
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{
    "assessmentId": "507f1f77bcf86cd799439011"
  }'
```

**Request with Direct Features:**
```bash
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

**Response (Success):**
```json
{
  "top_career": "Engineering",
  "topN": [
    {
      "career": "Engineering",
      "A": 92.3,
      "B": 78.1,
      "S": 86.2,
      "ci": [82.0, 90.4]
    },
    {
      "career": "Science",
      "A": 88.0,
      "B": 75.0,
      "S": 83.2,
      "ci": [78.5, 87.9]
    },
    {
      "career": "IT/Data",
      "A": 85.5,
      "B": 72.3,
      "S": 80.4,
      "ci": [75.1, 85.7]
    },
    {
      "career": "Healthcare",
      "A": 75.2,
      "B": 82.1,
      "S": 78.0,
      "ci": [73.4, 82.6]
    },
    {
      "career": "Business",
      "A": 70.5,
      "B": 76.8,
      "S": 73.0,
      "ci": [68.2, 77.8]
    }
  ],
  "low_confidence": false,
  "reasons": [
    "Strong math_score (+1.1σ vs Engineering typical)",
    "Strong physics_score (+0.8σ vs Engineering typical)",
    "High self-study commitment (+0.5σ) aligns with Engineering",
    "Low absence pattern (+0.7σ) supports disciplined study"
  ],
  "predictionId": "507f1f77bcf86cd799439012",
  "timestamp": "2024-11-11T12:00:00.000Z",
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
}
```

**Response (Assessment Not Found):**
```json
{
  "message": "Assessment not found"
}
```

**Response (Missing Features):**
```json
{
  "message": "Missing required features",
  "missingFeatures": ["math_score", "physics_score"]
}
```

**Response (ML Service Error):**
```json
{
  "message": "ML service temporarily unavailable",
  "detail": "ML Service error (500): Prediction error: Models not loaded properly"
}
```

### 3. Prediction History
Get prediction history for a specific user.

**Request:**
```bash
curl -X GET "http://localhost:5000/api/ml/predictions/user123?page=1&limit=5"
```

**Response:**
```json
{
  "predictions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "user123",
      "assessmentId": "507f1f77bcf86cd799439011",
      "topCareer": "Engineering",
      "topN": [...],
      "reasons": [...],
      "lowConfidence": false,
      "createdAt": "2024-11-11T12:00:00.000Z",
      "updatedAt": "2024-11-11T12:00:00.000Z"
    }
  ],
  "currentPage": 1,
  "totalPages": 1,
  "totalPredictions": 1
}
```

### 4. Service Connection Test
Test the ML service connection with sample data.

**Request:**
```bash
curl -X GET http://localhost:5000/api/ml/test
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "ML service connection test passed"
}
```

**Response (Failure):**
```json
{
  "status": "failed", 
  "message": "ML service connection test failed"
}
```

## Test Scenarios

### Scenario 1: Engineering Student
High math/physics scores, moderate study hours, low absences.

```json
{
  "features": {
    "math_score": 90.0,
    "physics_score": 88.0,
    "chemistry_score": 75.0,
    "biology_score": 70.0,
    "english_score": 65.0,
    "history_score": 60.0,
    "geography_score": 65.0,
    "weekly_self_study_hours": 25.0,
    "absence_days": 3.0,
    "extracurricular_activities": 1,
    "part_time_job": 0
  }
}
```

**Expected:** Top career should be Engineering with high A score.

### Scenario 2: Healthcare Student  
High biology/chemistry scores, high study commitment, very low absences.

```json
{
  "features": {
    "math_score": 70.0,
    "physics_score": 65.0,
    "chemistry_score": 92.0,
    "biology_score": 95.0,
    "english_score": 78.0,
    "history_score": 75.0,
    "geography_score": 72.0,
    "weekly_self_study_hours": 30.0,
    "absence_days": 1.0,
    "extracurricular_activities": 1,
    "part_time_job": 0
  }
}
```

**Expected:** Top career should be Healthcare with high A and B scores.

### Scenario 3: Arts Student
High English/history, lower STEM scores, high extracurricular involvement.

```json
{
  "features": {
    "math_score": 50.0,
    "physics_score": 45.0,
    "chemistry_score": 48.0,
    "biology_score": 55.0,
    "english_score": 95.0,
    "history_score": 90.0,
    "geography_score": 85.0,
    "weekly_self_study_hours": 15.0,
    "absence_days": 8.0,
    "extracurricular_activities": 1,
    "part_time_job": 1
  }
}
```

**Expected:** Top career should be Arts, Education, or Law.

### Scenario 4: Low Confidence Case
Balanced scores across multiple domains.

```json
{
  "features": {
    "math_score": 75.0,
    "physics_score": 75.0,
    "chemistry_score": 75.0,
    "biology_score": 75.0,
    "english_score": 75.0,
    "history_score": 75.0,
    "geography_score": 75.0,
    "weekly_self_study_hours": 18.0,
    "absence_days": 5.0,
    "extracurricular_activities": 1,
    "part_time_job": 0
  }
}
```

**Expected:** `low_confidence: true`, close S scores between top careers.

## MongoDB Verification

Check that prediction results are properly saved:

```javascript
// Connect to MongoDB and check prediction_results collection
db.predictionresults.find().sort({createdAt: -1}).limit(5)

// Verify structure
db.predictionresults.findOne()
```

Expected document structure:
```json
{
  "_id": "...",
  "userId": "user123",
  "assessmentId": "507f1f77bcf86cd799439011", 
  "topCareer": "Engineering",
  "topN": [...],
  "reasons": [...],
  "lowConfidence": false,
  "createdAt": "2024-11-11T12:00:00.000Z",
  "updatedAt": "2024-11-11T12:00:00.000Z"
}
```

## Error Handling Tests

1. **ML Service Down:** Stop Python service, verify graceful error handling
2. **Invalid Assessment ID:** Use non-existent MongoDB ObjectId
3. **Malformed Features:** Send incomplete or invalid feature data
4. **Network Timeout:** Simulate slow ML service response
5. **Database Connection Issues:** Test with MongoDB down

## Performance Expectations

- Health check: < 100ms
- Prediction with assessment ID: < 5 seconds (including DB query + ML inference)
- Prediction with direct features: < 3 seconds
- Confidence interval generation: Adds ~1 second

## Integration Notes

- Ensure both Node.js server (port 5000) and Python ML service (port 8001) are running
- MongoDB must be accessible with valid connection string
- Feature mapping handles missing academic subjects by using defaults
- All binary features (extracurricular_activities, part_time_job) must be 0 or 1
- Absence days are inverted during ML processing (higher processed value = lower actual absences)