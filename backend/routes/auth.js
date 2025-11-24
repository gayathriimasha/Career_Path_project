const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Helper function to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Register User - Completely rewritten
router.post("/register", async (req, res) => {
  try {
    console.log("=== Registration Request Received ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // Extract and validate input
    const { fullName, email, password, confirmPassword } = req.body;

    // Validation checks
    if (!fullName || !email || !password || !confirmPassword) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    if (password.length < 6) {
      console.log("❌ Password too short");
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    console.log("Checking if user exists with email:", email);
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email);
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    console.log("✅ User does not exist, creating new user...");

    // Create new user object
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: password,
    });

    console.log("Attempting to save user to database...");

    // Save user to database
    const savedUser = await newUser.save();

    console.log("✅ USER SAVED TO DATABASE SUCCESSFULLY!");
    console.log("User ID:", savedUser._id);
    console.log("Name:", savedUser.fullName);
    console.log("Email:", savedUser.email);
    console.log("Created At:", savedUser.createdAt);

    // Return success response
    return res.status(201).json({
      message: "Registration successful",
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullName,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      },
    });

  } catch (error) {
    console.error("❌ REGISTRATION ERROR:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists in database",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error: " + error.message,
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
});

// Login User - Rewritten
router.post("/login", async (req, res) => {
  try {
    console.log("=== Login Request Received ===");
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("❌ Missing email or password");
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    console.log("Looking up user with email:", email);

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("User found, checking password...");

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      console.log("❌ Invalid password");
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    console.log("✅ LOGIN SUCCESSFUL!");
    console.log("User ID:", user._id);
    console.log("Name:", user.fullName);
    console.log("Email:", user.email);

    // Generate token and send response
    const token = generateToken(user._id);

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
      token: token,
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:");
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    return res.status(500).json({
      message: "Server error during login",
      error: error.message,
    });
  }
});

module.exports = router;
