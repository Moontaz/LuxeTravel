const prisma = require("../db.js"); // Import Prisma Client
const logger = require("../config/logger"); // Import logger

const generateUID = () => {
  // Your implementation for generating UID
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const response = await prisma.Users.findMany(); // Use plural "Users" as per the updated Prisma schema
    logger.info("Successfully fetched all users"); // Log info
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const response = await prisma.Users.findUnique({
      where: { user_id: parseInt(req.params.id) }, // Prisma uses field names as per the schema
    });
    if (!response) {
      logger.warn(`User not found with ID: ${req.params.id}`); // Log warning
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`Successfully fetched user with ID: ${req.params.id}`); // Log info
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error fetching user by ID: ${error.message}`); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    req.body.uid = generateUID(); // Assuming generateUID is defined somewhere
    const newUser = await prisma.Users.create({
      data: req.body, // Prisma uses the "data" key for creation
    });
    logger.info(`User created with UID: ${req.body.uid}`); // Log info
    res.status(201).json(newUser);
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`); // Log error
    res.status(500).json({ error: "Server Error" });
  }
};

// Update a user by UID
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await prisma.Users.update({
      where: { uid: req.params.uid },
      data: req.body, // Prisma uses "data" to specify the fields to update
    });
    if (!updatedUser) {
      logger.warn(`User not found for UID: ${req.params.uid}`); // Log warning
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`User updated with UID: ${req.params.uid}`); // Log info
    res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`); // Log error
    res.status(500).json({ error: "Server Error" });
  }
};

// Delete a user by UID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await prisma.Users.delete({
      where: { uid: req.params.uid },
    });
    if (!deletedUser) {
      logger.warn(`User not found for UID: ${req.params.uid}`); // Log warning
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`User deleted with UID: ${req.params.uid}`); // Log info
    res.status(200).json("User Deleted");
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`); // Log error
    res.status(500).json({ error: "Server Error" });
  }
};
