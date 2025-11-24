const express = require("express")
const Assessment = require("../models/Assessment")
const Prediction = require("../models/Prediction")
const axios = require("axios")
const router = express.Router()

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000"

// Submit assessment
router.post("/submit", async (req, res) => {
  try {
    const { userId, userEmail, userName, answers } = req.body

    // Validate answers
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Invalid request: 'answers' must be an array",
        received: typeof answers
      })
    }

    // Call ML service for predictions
    let predictions = []
    let mlMetadata = {}

    try {
      console.log("Calling ML service with answers:", answers.length, "answers")
      const mlResponse = await axios.post(`${ML_SERVICE_URL}/predict`, {
        answers: answers
      }, {
        timeout: 10000
      })

      predictions = mlResponse.data.predictions
      mlMetadata = mlResponse.data.metadata

      console.log("ML prediction successful:", predictions)
    } catch (mlError) {
      console.error("ML service error:", mlError.message)
      if (mlError.response) {
        console.error("ML service response status:", mlError.response.status)
        console.error("ML service response data:", mlError.response.data)
      }
      return res.status(503).json({
        message: "ML service unavailable. Please ensure the ML service is running.",
        error: mlError.response?.data || mlError.message
      })
    }

    // Extract academic scores for storage
    const scores = extractAcademicScores(answers)

    // Create assessment with predictions
    const assessment = new Assessment({
      userId,
      userEmail,
      userName,
      answers,
      scores,
      predictions: predictions.map(p => ({
        career: p.career,
        confidence: p.confidence,
        subcareers: p.subcareers
      })),
      mlMetadata,
      traits: []
    })

    const savedAssessment = await assessment.save()

    console.log('✅ Assessment saved successfully to database!');
    console.log('Assessment ID:', savedAssessment._id);
    console.log('User:', savedAssessment.userName, '(', savedAssessment.userEmail, ')');
    console.log('Predictions saved:', savedAssessment.predictions.length, 'career predictions');
    savedAssessment.predictions.forEach((pred, idx) => {
      console.log(`  ${idx + 1}. ${pred.career} - Confidence: ${(pred.confidence * 100).toFixed(1)}%`);
      console.log(`     Subcareers: ${pred.subcareers.join(', ')}`);
    });

    // Save to Predictions collection with all data
    const topPrediction = predictions[0] || {};
    const predictionRecord = new Prediction({
      assessmentId: savedAssessment._id,
      userId,
      userEmail,
      userName,
      predictions: predictions.map(p => ({
        career: p.career,
        confidence: p.confidence,
        subcareers: p.subcareers || []
      })),
      topCareer: topPrediction.career,
      topConfidence: topPrediction.confidence,
      topSubcareers: topPrediction.subcareers || [],
      scores,
      mlMetadata
    });

    const savedPrediction = await predictionRecord.save();

    console.log('✅ Prediction saved to Predictions collection!');
    console.log('Prediction ID:', savedPrediction._id);
    console.log('Top Career:', savedPrediction.topCareer);
    console.log('All data saved: predictions, scores, mlMetadata, subcareers');

    res.status(201).json({
      message: "Assessment submitted successfully",
      assessmentId: savedAssessment._id,
      predictionId: savedPrediction._id,
      predictions: predictions
    })
  } catch (error) {
    console.error("Assessment error:", error)
    res.status(500).json({ message: error.message })
  }
})

// Get assessment by user ID
router.get("/user/:userId", async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json(assessments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get assessment by ID
router.get("/:id", async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" })
    }
    res.json(assessment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all assessments (for admin)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const assessments = await Assessment.find().sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Assessment.countDocuments()

    res.json({
      assessments,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalAssessments: total,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Helper function to extract academic scores
function extractAcademicScores(answers) {
  const scoreMapping = {
    "0 – 35": 1,
    "35 – 55": 2,
    "55 – 75": 3,
    "75 – 100": 4,
  }

  const scores = {}

  // Map question IDs to subjects (updated for new question structure)
  const subjectMapping = {
    24: "mathematics",
    25: "science",
    26: "biology",
    27: "business",
    28: "computerScience",
    29: "arts",
    30: "socialSciences"
  }

  answers.forEach((answer) => {
    if (subjectMapping[answer.questionId]) {
      const subject = subjectMapping[answer.questionId]
      scores[subject] = scoreMapping[answer.value] || 0
    }
  })

  return scores
}

module.exports = router
