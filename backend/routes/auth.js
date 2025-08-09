const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  })
}

// Register User
router.post("/register", async (req, res) => {
  const { fullName, nic, email, phoneNumber, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" })
  }

  try {
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const nicExists = await User.findOne({ nic })
    if (nicExists) {
      return res.status(400).json({ message: "User with this NIC already exists" })
    }

    const user = await User.create({
      fullName,
      nic,
      email,
      phoneNumber,
      password,
    })

    if (user) {
      res.status(201).json({
        message: "Registration successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      })
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        message: "Login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: "Invalid email or password" })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

module.exports = router