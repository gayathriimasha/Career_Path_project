const mongoose = require("mongoose");

const careerScoreSchema = new mongoose.Schema({
  career: String,
  A: Number,
  B: Number,
  S: Number,
  S_final: Number,
  ci: [Number]
}, { _id: false });

const predictionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    topCareer: {
      main: String,
      sub: String
    },
    topN: [careerScoreSchema],
    reasons: [String],
    lowConfidence: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prediction", predictionSchema);
