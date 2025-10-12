const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../db.js"); // Prisma Client
const logger = require("../config/logger"); // Winston logger

const router = express.Router();
const SECRET_KEY = "inisangatrahasiabanget"; // Use env variable in production

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      logger.info(`Registration attempt for existing user: ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    logger.info(`New user registered: ${email}`);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(`Error during registration: ${error.message}`);
    // console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Login a user and return JWT token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    logger.info(`Login attempt for email: ${email}`);

    // Find user in the database
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      logger.info(`Login attempt for non-existing user: ${email}`);
      return res.status(404).json({ message: "No user found" });
    }

    logger.info(`User found with ID: ${user.user_id}`);

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.info(`Invalid password attempt for user: ${email}`);
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const tokenPayload = {
      id: user.user_id,
      name: user.name,
      email: user.email,
    };

    logger.info(
      `Generating token with payload: ${JSON.stringify(tokenPayload)}`
    );

    const token = jwt.sign(tokenPayload, SECRET_KEY, {
      expiresIn: "1h",
    });

    logger.info(`Token generated successfully for user: ${email}`);
    logger.info(`Token preview: ${token.substring(0, 20)}...`);

    res.status(200).json({
      success: true,
      token,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    console.error(`Error logging in user: ${error.message}`);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
