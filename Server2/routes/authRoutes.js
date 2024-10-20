const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db.js"); // Use Prisma instead of Sequelize
const logger = require("../config/logger"); // Import logger

const router = express.Router();
const SECRET_KEY = "inibuatpesenmakanan"; // Use env variable in production

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      logger.warn(
        `User registration failed: User already exists with email ${email}`
      ); // Log warning
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    logger.info(`User registered successfully: ${name} (${email})`); // Log info

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`Error registering user: ${error.message}`); // Log error
    res.status(500).json({ message: "Server Error" });
  }
});

// Login a user and return JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      logger.warn(`Login attempt failed: No user found with email ${email}`); // Log warning
      return res.status(404).json({ message: "No user found" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Login attempt failed: Invalid password for email ${email}`); // Log warning
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.user_id,
        name: user.name,
        email: user.email,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    logger.info(`User logged in successfully: ${email}`); // Log info
    // Return the token in the response
    res.status(200).json({ token });
  } catch (error) {
    logger.error(`Error logging in user: ${error.message}`); // Log error
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
