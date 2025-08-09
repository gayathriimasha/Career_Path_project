const mongoose = require("mongoose")

const questionSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["text", "radio", "checkbox"],
    },
    options: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ["personal", "academic", "behavioral", "skills"],
      default: "personal",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Question", questionSchema)