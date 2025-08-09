const mongoose = require("mongoose")
const Question = require("../models/Question")
const dotenv = require("dotenv")

dotenv.config()

const questionsData = [
  {
    id: 1,
    text: "Your name?",
    type: "text",
    category: "personal",
  },
  {
    id: 2,
    text: "Your email?",
    type: "text",
    category: "personal",
  },
  {
    id: 3,
    text: "Your gender?",
    type: "radio",
    options: ["Male", "Female", "Other", "Prefer not to say"],
    category: "personal",
  },
  {
    id: 4,
    text: "You have a challenging math puzzle that no one in class can solve. What do you do?",
    type: "radio",
    options: [
      "Try to solve it step-by-step using logic",
      "Search online for similar examples",
      "Ask a teacher or friend to guide you",
      "Leave it for later, puzzles aren't really your thing",
    ],
    category: "behavioral",
  },
  {
    id: 5,
    text: "Your school asks for help with a campaign to reduce plastic waste. Which role do you want?",
    type: "radio",
    options: [
      "Design posters and social media content",
      "Write a powerful message to share",
      "Plan how the campaign will be organized",
      "Record videos and edit content",
    ],
    category: "behavioral",
  },
  {
    id: 6,
    text: "Your team at school is preparing for a competition. How do you contribute?",
    type: "radio",
    options: [
      "Assign roles and lead meetings",
      "Motivate others to do their best",
      "Manage the timeline and resources",
      "Help with designing the final product",
    ],
    category: "behavioral",
  },
  {
    id: 7,
    text: "A classmate is having trouble learning a new topic or stressed before a test. What do you do?",
    type: "radio",
    options: [
      "Explain it in a simple way with examples",
      "Sit with them and practice together",
      "Share useful resources and study hacks",
      "Encourage them and offer emotional support",
    ],
    category: "behavioral",
  },
  {
    id: 8,
    text: "Your school opens a Makerspace with tools and gadgets. What excites you most?",
    type: "radio",
    options: [
      "Building something from scratch",
      "Understanding how machines work",
      "Designing a cool product or prototype",
      "Testing how different tools function",
    ],
    category: "behavioral",
  },
  {
    id: 9,
    text: "You're given a chance to join a school trip to explore a new place. What are you looking forward to?",
    type: "radio",
    options: [
      "Discovering how things work in different environments",
      "Meeting people and learning about their lives",
      "Taking notes, pictures, and documenting the trip",
      "Exploring new ideas and future possibilities",
    ],
    category: "behavioral",
  },
  {
    id: 10,
    text: "Your class is preparing a charity event next month. What task do you choose?",
    type: "radio",
    options: [
      "Create the checklist and assign duties",
      "Budget the expenses and plan the event",
      "Prepare the materials and schedule",
      "Coordinate communication between the group",
    ],
    category: "behavioral",
  },
  {
    id: 11,
    text: "Your school is hosting a talent show at the end of the year. What role do you want?",
    type: "radio",
    options: [
      "Perform on stage – sing, dance, or act",
      "Host or MC the event with confidence",
      "Work behind the scenes on lights/sound",
      "Promote the event and design materials",
    ],
    category: "behavioral",
  },
  {
    id: 12,
    text: "Your mathematics score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 13,
    text: "Your physics score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 14,
    text: "Your biology score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 15,
    text: "Your chemistry score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 16,
    text: "Your business score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 17,
    text: "Your economics score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 18,
    text: "Your art/music/dancing score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 19,
    text: "Your psychology score?",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic",
  },
  {
    id: 20,
    text: "How many hours do you study per day on average?",
    type: "radio",
    options: ["0 – 3", "3 – 6", "6 – 10", "10 – 15"],
    category: "academic",
  },
  {
    id: 21,
    text: "How many hours do you spend on self-study per week?",
    type: "radio",
    options: ["0 – 3", "3 – 6", "6 – 10", "10 – 15"],
    category: "academic",
  },
  {
    id: 22,
    text: "Do you attend any extra classes or tutoring sessions?",
    type: "radio",
    options: ["Yes", "No"],
    category: "academic",
  },
  {
    id: 23,
    text: "Do you attend any extracurricular activities?",
    type: "radio",
    options: ["Yes", "No"],
    category: "academic",
  },
  {
    id: 24,
    text: "Which career do you see yourself pursuing after your studies?",
    type: "text",
    category: "personal",
  },
  {
    id: 25,
    text: "Which of the following skills do you feel confident in?",
    type: "checkbox",
    options: [
      "problem solving",
      "teamwork",
      "growth mindset",
      "multitasking",
      "communication",
      "time management",
      "digital literacy",
      "leadership",
      "critical thinking",
      "adaptability",
      "creativity",
      "decision making",
    ],
    category: "skills",
  },
]

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected to MongoDB")

    // Clear existing questions
    await Question.deleteMany({})
    console.log("Cleared existing questions")

    // Insert new questions
    await Question.insertMany(questionsData)
    console.log("Questions seeded successfully")

    mongoose.connection.close()
  } catch (error) {
    console.error("Error seeding questions:", error)
    mongoose.connection.close()
  }
}

seedQuestions()