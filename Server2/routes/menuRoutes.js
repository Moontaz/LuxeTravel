const express = require("express");
const { getMenu } = require("../controllers/MenuController.js"); // Prisma-based controller
const verifyToken = require("../middleware/auth.js"); // JWT middleware
const logger = require("../config/logger"); // Import logger

const router = express.Router();

// Protected route: Get all available menus
router.get("/menu", verifyToken, async (req, res, next) => {
  try {
    logger.info(`User ID ${req.userId} is requesting the menu`); // Log info
    await getMenu(req, res); // Execute the Prisma-based controller function
  } catch (error) {
    next(error); // Handle any errors and pass to the next middleware
  }
});

module.exports = router;
