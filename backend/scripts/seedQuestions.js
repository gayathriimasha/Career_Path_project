const mongoose = require("mongoose")
const Question = require("../models/Question")
const dotenv = require("dotenv")
const path = require("path")

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, "..", ".env") })

const questionsData = [
  {
    id: 1,
    text: "Your name?",
    type: "text",
    category: "personal"
  },
  {
    id: 2,
    text: "Your email?",
    type: "text",
    category: "personal"
  },
  {
    id: 3,
    text: "Your gender?",
    type: "radio",
    options: ["Male", "Female", "Other", "Prefer not to say"],
    category: "personal"
  },
  {
    id: 4,
    text: "When faced with a complex problem, you prefer to:",
    type: "radio",
    options: [
      "Break it down into logical steps and analyze systematically",
      "Research similar cases and apply proven solutions",
      "Brainstorm creative alternatives and experiment",
      "Discuss with others to understand different perspectives"
    ],
    category: "behavioral"
  },
  {
    id: 5,
    text: "Your ideal work setting would be:",
    type: "radio",
    options: [
      "Laboratory or research facility with controlled environment",
      "Hospital or clinic helping people directly",
      "Workshop or site building tangible solutions",
      "Office managing operations and people"
    ],
    category: "behavioral"
  },
  {
    id: 6,
    text: "When you see someone struggling, your first instinct is to:",
    type: "radio",
    options: [
      "Analyze the root cause and suggest practical solutions",
      "Offer emotional support and listen to their concerns",
      "Share your experience and teach them skills",
      "Connect them with resources or people who can help"
    ],
    category: "behavioral"
  },
  {
    id: 7,
    text: "How do you approach learning something completely new?",
    type: "radio",
    options: [
      "Study theory first, then practice systematically",
      "Jump in and learn by doing",
      "Watch demonstrations and replicate step-by-step",
      "Combine multiple resources and experiment"
    ],
    category: "behavioral"
  },
  {
    id: 8,
    text: "In a group emergency situation, you would most likely:",
    type: "radio",
    options: [
      "Take charge and coordinate the response",
      "Stay calm and provide immediate practical help",
      "Follow protocols and ensure safety procedures",
      "Support others emotionally and maintain morale"
    ],
    category: "behavioral"
  },
  {
    id: 9,
    text: "Your relationship with technology is:",
    type: "radio",
    options: [
      "I love coding, building systems, and troubleshooting technical issues",
      "I use it as a tool to enhance my work efficiency",
      "I'm comfortable with standard applications but not programming",
      "I prefer hands-on physical work over digital tools"
    ],
    category: "behavioral"
  },
  {
    id: 10,
    text: "What type of project excites you most?",
    type: "radio",
    options: [
      "Discovering something new through research and experimentation",
      "Designing and building a physical structure or product",
      "Creating art, media, or visual experiences",
      "Improving how organizations or communities function"
    ],
    category: "behavioral"
  },
  {
    id: 11,
    text: "When making important decisions, you rely most on:",
    type: "radio",
    options: [
      "Data, statistics, and measurable evidence",
      "Expert consultation and established best practices",
      "Intuition and past experience",
      "Consensus and input from affected people"
    ],
    category: "behavioral"
  },
  {
    id: 12,
    text: "Your tolerance for routine and repetition is:",
    type: "radio",
    options: [
      "High - I find structure and routine comforting",
      "Moderate - I can handle routine but need some variety",
      "Low - I need constant change and new challenges",
      "I can optimize routine tasks to make them efficient"
    ],
    category: "behavioral"
  },
  {
    id: 13,
    text: "In conversations, you naturally:",
    type: "radio",
    options: [
      "Focus on facts, logic, and accurate information",
      "Listen actively and show empathy for feelings",
      "Share stories and use vivid descriptions",
      "Guide discussion toward practical outcomes"
    ],
    category: "behavioral"
  },
  {
    id: 14,
    text: "Your approach to physical versus mental work is:",
    type: "radio",
    options: [
      "I prefer mental challenges and intellectual work",
      "I enjoy balanced combination of both",
      "I thrive on physical activity and hands-on tasks",
      "I prefer physical work but with planning elements"
    ],
    category: "behavioral"
  },
  {
    id: 15,
    text: "When evaluating success, you measure by:",
    type: "radio",
    options: [
      "Scientific accuracy and quality of results",
      "Positive impact on people's lives",
      "Innovation and originality of solution",
      "Efficiency and profitability achieved"
    ],
    category: "behavioral"
  },
  {
    id: 16,
    text: "Your comfort level with uncertainty and ambiguity is:",
    type: "radio",
    options: [
      "Low - I need clear guidelines and procedures",
      "Moderate - I can adapt but prefer some structure",
      "High - I thrive in ambiguous and changing situations",
      "I can handle uncertainty when there's a clear goal"
    ],
    category: "behavioral"
  },
  {
    id: 17,
    text: "What motivates you most in your work?",
    type: "radio",
    options: [
      "Intellectual curiosity and advancing knowledge",
      "Saving lives and improving health",
      "Financial success and business growth",
      "Self-expression and creative freedom"
    ],
    category: "behavioral"
  },
  {
    id: 18,
    text: "How do you respond to criticism of your work?",
    type: "radio",
    options: [
      "Analyze it objectively to improve quality",
      "Feel concerned about others' wellbeing and perceptions",
      "Defend my methods if I believe they're correct",
      "Use it as learning opportunity for growth"
    ],
    category: "behavioral"
  },
  {
    id: 19,
    text: "Your preferred leadership style is:",
    type: "radio",
    options: [
      "Lead by expertise and technical knowledge",
      "Lead through vision and inspiration",
      "Lead by organizing and delegating efficiently",
      "Lead through collaboration and team empowerment"
    ],
    category: "behavioral"
  },
  {
    id: 20,
    text: "When you complete a task, your priority is:",
    type: "radio",
    options: [
      "Precision and accuracy of every detail",
      "Positive outcome for people involved",
      "Innovative or aesthetic quality of result",
      "Meeting deadlines and budget constraints"
    ],
    category: "behavioral"
  },
  {
    id: 21,
    text: "In your free time, you prefer:",
    type: "radio",
    options: [
      "Reading, research, or intellectual hobbies",
      "Volunteering or helping in your community",
      "Creating art, music, or other creative projects",
      "Outdoor activities, sports, or practical hobbies"
    ],
    category: "behavioral"
  },
  {
    id: 22,
    text: "Your ethical decision-making is guided by:",
    type: "radio",
    options: [
      "Logical analysis of outcomes and consequences",
      "Compassion and minimizing harm to others",
      "Following established rules and regulations",
      "Balancing multiple stakeholder interests"
    ],
    category: "behavioral"
  },
  {
    id: 23,
    text: "How do you handle high-pressure deadlines?",
    type: "radio",
    options: [
      "Thrive under pressure and deliver best work",
      "Stay focused but feel stressed internally",
      "Need careful planning to avoid last-minute pressure",
      "Perform well but prefer more time for quality"
    ],
    category: "behavioral"
  },
  {
    id: 24,
    text: "Your mathematics/quantitative skills score (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  },
  {
    id: 25,
    text: "Your science (Physics/Chemistry) score (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  },
  {
    id: 26,
    text: "Your biology/life sciences score (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  },
  {
    id: 27,
    text: "Your business/economics score (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  },
  {
    id: 28,
    text: "Your computer science/IT skills (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  },
  {
    id: 29,
    text: "Your arts/creative subjects score (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  },
  {
    id: 30,
    text: "Your social sciences/humanities score (0-100):",
    type: "radio",
    options: ["0 – 35", "35 – 55", "55 – 75", "75 – 100"],
    category: "academic"
  }
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