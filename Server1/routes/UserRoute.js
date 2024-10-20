const express = require("express");
const {
  getUsers,
  getUserByUid,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/UserController.js");
const logger = require("../config/logger"); // Import the logger

const router = express.Router();

// Get all users
router.get("/users", (req, res, next) => {
  logger.info("Request to get all users"); // Log info
  getUsers(req, res).catch(next); // Handle errors in controller
});

// Get user by UID
router.get("/users/:uid", (req, res, next) => {
  logger.info(`Request to get user with UID: ${req.params.uid}`); // Log info
  getUserByUid(req, res).catch(next); // Handle errors in controller
});

// Create a new user
router.post("/users", (req, res, next) => {
  logger.info("Request to create a new user"); // Log info
  createUser(req, res).catch(next); // Handle errors in controller
});

// Update a user by UID
router.patch("/users/:uid", (req, res, next) => {
  logger.info(`Request to update user with UID: ${req.params.uid}`); // Log info
  updateUser(req, res).catch(next); // Handle errors in controller
});

// Delete a user by UID
router.delete("/users/:uid", (req, res, next) => {
  logger.info(`Request to delete user with UID: ${req.params.uid}`); // Log info
  deleteUser(req, res).catch(next); // Handle errors in controller
});

module.exports = router;
