const express = require("express")
const Question = require("../models/Question")
const router = express.Router()

// Get all questions
router.get("/", async (req, res) => {
  try {
    const questions = await Question.find({ isActive: true }).sort({ id: 1 })
    res.json(questions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get question by ID
router.get("/:id", async (req, res) => {
  try {
    const question = await Question.findOne({ id: req.params.id })
    if (!question) {
      return res.status(404).json({ message: "Question not found" })
    }
    res.json(question)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Create new question (for admin use)
router.post("/", async (req, res) => {
  try {
    const question = new Question(req.body)
    const savedQuestion = await question.save()
    res.status(201).json(savedQuestion)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Update question
router.put("/:id", async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
    if (!question) {
      return res.status(404).json({ message: "Question not found" })
    }
    res.json(question)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Delete question (soft delete)
router.delete("/:id", async (req, res) => {
  try {
    const question = await Question.findOneAndUpdate({ id: req.params.id }, { isActive: false }, { new: true })
    if (!question) {
      return res.status(404).json({ message: "Question not found" })
    }
    res.json({ message: "Question deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router