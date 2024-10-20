const prisma = require("../db.js"); // Prisma instance
const logger = require("../config/logger"); // Import logger

const getUsers = async (req, res) => {
  try {
    const response = await prisma.user.findMany(); // Prisma query to fetch all users
    logger.info("Successfully fetched all users"); // Log info
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const response = await prisma.user.findUnique({
      where: { user_id: parseInt(req.params.id) }, // Prisma uses findUnique for unique fields
    });
    if (response) {
      logger.info(`Successfully fetched user with ID: ${req.params.id}`); // Log info
      res.status(200).json(response);
    } else {
      logger.warn(`User not found with ID: ${req.params.id}`); // Log warning
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error(`Error fetching user by ID: ${error.message}`); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  try {
    req.body.uid = generateUID(); // Assuming generateUID is defined somewhere
    await prisma.user.create({
      data: req.body, // Prisma uses data key to create a new record
    });
    logger.info(`User created with UID: ${req.body.uid}`); // Log info
    res.status(201).json("User Created");
  } catch (error) {
    logger.error(`Error creating user: ${error.message}`); // Log error
    res.status(500).json({ error: "Server Error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { uid: req.params.uid }, // Match UID
      data: req.body, // Update the user with new data
    });
    if (!updatedUser) {
      logger.warn(`User not found for UID: ${req.params.uid}`); // Log warning
      res.status(404).json({ error: "User not found" });
    } else {
      logger.info(`User updated with UID: ${req.params.uid}`); // Log info
      res.status(200).json("User Updated");
    }
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`); // Log error
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const deletedUser = await prisma.user.delete({
      where: { uid: req.params.uid }, // Delete by UID
    });
    if (!deletedUser) {
      logger.warn(`User not found for UID: ${req.params.uid}`); // Log warning
      res.status(404).json({ error: "User not found" });
    } else {
      logger.info(`User deleted with UID: ${req.params.uid}`); // Log info
      res.status(200).json("User Deleted");
    }
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`); // Log error
    res.status(500).json({ error: "Server Error" });
  }
};

// Export all functions
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
