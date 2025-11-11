/**
 * ML Prediction Routes
 * Endpoint: POST /api/ml/predict
 *
 * Example usage:
 * curl -X POST http://localhost:5000/api/ml/predict \
 *   -H "Content-Type: application/json" \
 *   -d '{"assessmentId": "60f7b3b3b3b3b3b3b3b3b3b3"}'
 */

const express = require("express");
const Assessment = require("../models/Assessment");
const Prediction = require("../models/Prediction");
const PredictionLog = require("../models/PredictionLog");
const { mapAssessmentToFeatures } = require("../mlbridge/featureMapping");
const { scoreAssessment, healthCheck } = require("../mlbridge/mlClient");

const router = express.Router();

/**
 * POST /api/ml/predict
 * Predict career path from assessment
 */
router.post("/predict", async (req, res) => {
  try {
    const { assessmentId } = req.body;

    if (!assessmentId) {
      return res.status(400).json({
        success: false,
        message: "assessmentId is required"
      });
    }

    // Fetch assessment
    const assessment = await Assessment.findById(assessmentId);

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "Assessment not found"
      });
    }

    // Map to features
    let featurePayload;
    try {
      featurePayload = mapAssessmentToFeatures(assessment);
    } catch (mappingError) {
      return res.status(400).json({
        success: false,
        message: `Feature mapping error: ${mappingError.message}`
      });
    }

    // Call ML service
    let mlResponse;
    try {
      mlResponse = await scoreAssessment(featurePayload);
    } catch (mlError) {
      return res.status(503).json({
        success: false,
        message: mlError.message,
        hint: "Make sure the Python ML service is running: uvicorn src.service:app --host 127.0.0.1 --port 8001 --reload"
      });
    }

    // Save prediction result
    const prediction = new Prediction({
      userId: assessment.userId,
      assessmentId: assessment._id,
      topCareer: mlResponse.top_career,
      topN: mlResponse.topN,
      reasons: mlResponse.reasons,
      lowConfidence: mlResponse.low_confidence
    });

    await prediction.save();

    // Log prediction for monitoring
    try {
      const predictionLog = new PredictionLog({
        assessmentId: assessment._id,
        userId: assessment.userId,
        predictedCareer: mlResponse.top_career,
        confidence: mlResponse.topN && mlResponse.topN.length > 0 ? mlResponse.topN[0].S_final / 100 : 0,
        topNScores: mlResponse.topN ? mlResponse.topN.slice(0, 5).map(c => ({
          career: c.career,
          score: c.S_final
        })) : [],
        lowConfidence: mlResponse.low_confidence,
        modelVersion: "1.0.0"
      });
      await predictionLog.save();
    } catch (logError) {
      console.error("Warning: Failed to log prediction:", logError);
      // Don't fail the request if logging fails
    }

    // Return result
    res.json({
      success: true,
      predictionId: prediction._id,
      data: {
        topCareer: mlResponse.top_career,
        topN: mlResponse.topN,
        reasons: mlResponse.reasons,
        lowConfidence: mlResponse.low_confidence,
        counterfactuals: mlResponse.counterfactuals
      }
    });

  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during prediction",
      error: error.message
    });
  }
});

/**
 * GET /api/ml/predictions/user/:userId
 * Get all predictions for a user
 */
router.get("/predictions/user/:userId", async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .populate("assessmentId");

    res.json({
      success: true,
      count: predictions.length,
      predictions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/ml/prediction/:id
 * Get a specific prediction by ID
 */
router.get("/prediction/:id", async (req, res) => {
  try {
    const prediction = await Prediction.findById(req.params.id)
      .populate("assessmentId");

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction not found"
      });
    }

    res.json({
      success: true,
      prediction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

/**
 * GET /api/ml/health
 * Check ML service health
 */
router.get("/health", async (req, res) => {
  const isHealthy = await healthCheck();

  res.json({
    success: true,
    mlServiceHealthy: isHealthy,
    message: isHealthy
      ? "ML service is running"
      : "ML service is not available. Start it with: cd ml && uvicorn src.service:app --host 127.0.0.1 --port 8001"
  });
});

module.exports = router;
