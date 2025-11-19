const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed, // Can be string or array
    required: true,
  },
})

const assessmentSchema = new mongoose.Schema(
  {
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
    answers: [answerSchema],
    completedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "completed",
    },
    // Calculated scores based on answers
    scores: {
      mathematics: Number,
      physics: Number,
      biology: Number,
      chemistry: Number,
      business: Number,
      economics: Number,
      arts: Number,
      psychology: Number,
    },
    // Personality traits derived from behavioral questions
    traits: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // ML predictions
    predictions: [{
      career: String,
      confidence: Number,
      subcareers: [String]
    }],
    // ML model metadata
    mlMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    }
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Assessment", assessmentSchema)