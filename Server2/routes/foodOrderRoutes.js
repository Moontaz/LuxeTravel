const express = require("express");
const {
  getFoodOrders,
  getFoodOrderByTicketCode,
  createFoodOrder,
  updateFoodOrder,
  deleteFoodOrder,
} = require("../controllers/FoodOrderController.js"); // Updated Prisma-based controllers
const verifyToken = require("../middleware/auth.js"); // JWT middleware for authentication
const logger = require("../config/logger"); // Import logger

const router = express.Router();

// Protected route: Get all food orders (user must be authenticated)
router.get("/getallorders", verifyToken, async (req, res, next) => {
  try {
    logger.info(`User ID ${req.userId} is requesting all food orders`); // Log info
    await getFoodOrders(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected route: Get a specific food order by Ticket Code
router.get("/getorder/:ticket_code", verifyToken, async (req, res, next) => {
  try {
    logger.info(
      `User ID ${req.userId} is requesting food order for ticket code: ${req.params.ticket_code}`
    ); // Log info
    await getFoodOrderByTicketCode(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected route: Create a new food order (ticket_code comes from client)
router.post("/order-food", verifyToken, async (req, res, next) => {
  try {
    logger.info(`User ID ${req.userId} is creating a new food order`); // Log info
    await createFoodOrder(req, res);
  } catch (error) {
    next(error);
  }
});

// Alternative route for compatibility
router.post("/order", verifyToken, async (req, res, next) => {
  try {
    logger.info(
      `User ID ${req.userId} is creating a new food order (alternative route)`
    ); // Log info
    await createFoodOrder(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected route: Update a food order by ID
router.put("/updateorder/:id", verifyToken, async (req, res, next) => {
  try {
    logger.info(
      `User ID ${req.userId} is updating food order with ID: ${req.params.id}`
    ); // Log info
    await updateFoodOrder(req, res);
  } catch (error) {
    next(error);
  }
});

// Protected route: Delete a food order by ID
router.delete("/deleteorder/:id", verifyToken, async (req, res, next) => {
  try {
    logger.info(
      `User ID ${req.userId} is deleting food order with ID: ${req.params.id}`
    ); // Log info
    await deleteFoodOrder(req, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
