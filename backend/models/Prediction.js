const mongoose = require("mongoose");

const predictionSchema = new mongoose.Schema(
  {
    // Reference to assessment
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    // User information
    userId: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    // All career predictions (array of predictions)
    predictions: [{
      career: {
        type: String,
        required: true
      },
      confidence: {
        type: Number,
        required: true
      },
      subcareers: [String]
    }],
    // Top prediction details (first prediction)
    topCareer: {
      type: String,
      required: true
    },
    topConfidence: {
      type: Number,
      required: true
    },
    topSubcareers: [String],
    // Academic scores from questionnaire
    scores: {
      mathematics: Number,
      science: Number,
      biology: Number,
      business: Number,
      computerScience: Number,
      arts: Number,
      socialSciences: Number
    },
    // ML model metadata
    mlMetadata: {
      model_version: String,
      model_accuracy: Number,
      prediction_timestamp: String,
      features_used: [String],
      model_type: String
    },
    // Timestamp when prediction was made
    predictedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
predictionSchema.index({ userId: 1 });
predictionSchema.index({ userEmail: 1 });
predictionSchema.index({ topCareer: 1 });
predictionSchema.index({ predictedAt: -1 });

module.exports = mongoose.model("Prediction", predictionSchema);
