const mongoose = require("mongoose");

const predictionLogSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    predictedCareer: {
      main: String,
      sub: String
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    topNScores: [{
      career: String,
      score: Number
    }],
    lowConfidence: Boolean,
    modelVersion: {
      type: String,
      default: "1.0.0"
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
predictionLogSchema.index({ timestamp: -1 });
predictionLogSchema.index({ "predictedCareer.main": 1 });
predictionLogSchema.index({ userId: 1 });

module.exports = mongoose.model("PredictionLog", predictionLogSchema);
