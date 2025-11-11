const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

// Import routes
const questionRoutes = require("./routes/questions")
const assessmentRoutes = require("./routes/assessments")
const authRoutes = require("./routes/auth") // <-- Add this
const mlRoutes = require("./routes/ml")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas")
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

// Routes
app.use("/api/questions", questionRoutes)
app.use("/api/assessments", assessmentRoutes)
app.use("/api/auth", authRoutes) // <-- Add this
app.use("/api/ml", mlRoutes)

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Career Path Predictor API is running!" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
