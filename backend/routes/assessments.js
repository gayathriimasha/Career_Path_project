const express = require("express")
const Assessment = require("../models/Assessment")
const router = express.Router()

// Submit assessment
router.post("/submit", async (req, res) => {
  try {
    const { userId, userEmail, userName, answers } = req.body

    // Calculate scores from answers
    const scores = calculateScores(answers)
    const traits = calculateTraits(answers)

    const assessment = new Assessment({
      userId,
      userEmail,
      userName,
      answers,
      scores,
      traits,
    })

    const savedAssessment = await assessment.save()
    res.status(201).json({
      message: "Assessment submitted successfully",
      assessmentId: savedAssessment._id,
      scores,
      traits,
    })
  } catch (error) {
    res.status(400).json({ message: error.message })
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

// Helper function to calculate academic scores
function calculateScores(answers) {
  const scoreMapping = {
    "0 – 35": 1,
    "35 – 55": 2,
    "55 – 75": 3,
    "75 – 100": 4,
  }

  const scores = {}

  // Map question IDs to subjects
  const subjectMapping = {
    12: "mathematics",
    13: "physics",
    14: "biology",
    15: "chemistry",
    16: "business",
    17: "economics",
    18: "arts",
    19: "psychology",
  }

  answers.forEach((answer) => {
    if (subjectMapping[answer.questionId]) {
      const subject = subjectMapping[answer.questionId]
      scores[subject] = scoreMapping[answer.value] || 0
    }
  })

  return scores
}

// Helper function to calculate personality traits
function calculateTraits(answers) {
  const traits = {
    problemSolving: 0,
    leadership: 0,
    creativity: 0,
    analytical: 0,
    social: 0,
  }

  // Analyze behavioral questions (4-11) to determine traits
  answers.forEach((answer) => {
    if (answer.questionId >= 4 && answer.questionId <= 11) {
      const value = answer.value

      // Simple trait calculation based on answer patterns
      if (value.includes("solve") || value.includes("logic") || value.includes("step-by-step")) {
        traits.problemSolving += 1
      }
      if (value.includes("lead") || value.includes("organize") || value.includes("manage")) {
        traits.leadership += 1
      }
      if (value.includes("design") || value.includes("create") || value.includes("build")) {
        traits.creativity += 1
      }
      if (value.includes("analyze") || value.includes("understand") || value.includes("research")) {
        traits.analytical += 1
      }
      if (value.includes("help") || value.includes("support") || value.includes("teach")) {
        traits.social += 1
      }
    }
  })

  return traits
}

module.exports = router