const express = require("express");
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController.js"); // Prisma-based controllers
const logger = require("../config/logger"); // Import logger

const router = express.Router();

// Get all users
router.get("/users", async (req, res, next) => {
  try {
    logger.info("Request to get all users"); // Log info
    await getUsers(req, res); // Call Prisma-based controller
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

// Create a new user
router.post("/users", async (req, res, next) => {
  try {
    logger.info("Request to create a new user"); // Log info
    await createUser(req, res); // Call Prisma-based controller
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

// Update a user by UID
router.patch("/users/:uid", async (req, res, next) => {
  try {
    logger.info(`Request to update user with UID: ${req.params.uid}`); // Log info
    await updateUser(req, res); // Call Prisma-based controller
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

// Delete a user by UID
router.delete("/users/:uid", async (req, res, next) => {
  try {
    logger.info(`Request to delete user with UID: ${req.params.uid}`); // Log info
    await deleteUser(req, res); // Call Prisma-based controller
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

module.exports = router;
