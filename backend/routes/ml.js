const express = require("express");
const Assessment = require("../models/Assessment");
const MLClient = require("../mlbridge/mlClient");
const { mapAssessmentToFeatures } = require("../mlbridge/featureMapping");
const mongoose = require("mongoose");
const router = express.Router();

// Initialize ML client
const mlClient = new MLClient();

// Create a new Mongoose model for prediction results
const predictionResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment',
    required: true,
  },
  topCareer: {
    type: String,
    required: true,
  },
  topN: [{
    career: String,
    A: Number,
    B: Number,
    S: Number,
    ci: [Number]
  }],
  reasons: [String],
  lowConfidence: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const PredictionResult = mongoose.model("PredictionResult", predictionResultSchema);

/**
 * POST /api/ml/predict
 * Predict career recommendations based on assessment
 */
router.post("/predict", async (req, res) => {
  try {
    const { assessmentId, features } = req.body;
    
    let mappedFeatures;
    let userId;
    let assessment;

    if (assessmentId) {
      // Get assessment from database
      assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      userId = assessment.userId;
      
      // Map assessment to ML features
      mappedFeatures = mapAssessmentToFeatures(assessment);
      console.log("Mapped features from assessment:", mappedFeatures);
      
    } else if (features) {
      // Use provided features directly
      mappedFeatures = features;
      userId = features.userId || "anonymous";
      
    } else {
      return res.status(400).json({ 
        message: "Either assessmentId or features must be provided" 
      });
    }

    // Validate that all required features are present
    const requiredFeatures = [
      'math_score', 'physics_score', 'chemistry_score', 'biology_score',
      'english_score', 'history_score', 'geography_score',
      'weekly_self_study_hours', 'absence_days',
      'extracurricular_activities', 'part_time_job'
    ];

    const missingFeatures = requiredFeatures.filter(
      feature => mappedFeatures[feature] === undefined || mappedFeatures[feature] === null
    );

    if (missingFeatures.length > 0) {
      return res.status(400).json({
        message: "Missing required features",
        missingFeatures: missingFeatures
      });
    }

    // Call ML service
    console.log("Calling ML service with features:", mappedFeatures);
    
    const mlResponse = await mlClient.predictCareer(mappedFeatures);
    console.log("ML service response:", mlResponse);

    // Save prediction result to database
    const predictionResult = new PredictionResult({
      userId: userId,
      assessmentId: assessmentId || null,
      topCareer: mlResponse.top_career,
      topN: mlResponse.topN,
      reasons: mlResponse.reasons,
      lowConfidence: mlResponse.low_confidence
    });

    const savedPrediction = await predictionResult.save();
    console.log("Prediction result saved:", savedPrediction._id);

    // Return the ML response with additional metadata
    res.status(200).json({
      ...mlResponse,
      predictionId: savedPrediction._id,
      timestamp: savedPrediction.createdAt,
      features: mappedFeatures
    });

  } catch (error) {
    console.error("ML prediction error:", error);
    
    if (error.message.includes("ML Service")) {
      return res.status(503).json({ 
        message: "ML service temporarily unavailable", 
        detail: error.message 
      });
    }
    
    res.status(500).json({ 
      message: "Internal server error", 
      detail: error.message 
    });
  }
});

/**
 * GET /api/ml/health
 * Check ML service health
 */
router.get("/health", async (req, res) => {
  try {
    const healthStatus = await mlClient.healthCheck();
    res.json({
      mlService: healthStatus,
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      mlService: null,
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/ml/predictions/:userId
 * Get prediction history for a user
 */
router.get("/predictions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const predictions = await PredictionResult.find({ userId })
      .populate('assessmentId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await PredictionResult.countDocuments({ userId });

    res.json({
      predictions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPredictions: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/ml/test
 * Test ML service connection
 */
router.get("/test", async (req, res) => {
  try {
    const testResult = await mlClient.testConnection();
    if (testResult) {
      res.json({ 
        status: "success", 
        message: "ML service connection test passed" 
      });
    } else {
      res.status(503).json({ 
        status: "failed", 
        message: "ML service connection test failed" 
      });
    }
  } catch (error) {
    res.status(503).json({ 
      status: "error", 
      message: error.message 
    });
  }
});

module.exports = router;