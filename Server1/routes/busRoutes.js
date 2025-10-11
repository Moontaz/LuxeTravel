const express = require("express");
const verifyToken = require("../middleware/auth.js"); // JWT middleware
const {
  getBuses,
  getCities,
  getBusById,
  createTicket,
  getTicketsByUserId,
  getBookedSeatsByBusId,
} = require("../controllers/BusController.js"); // Import controller
const logger = require("../config/logger"); // Import the logger

const router = express.Router();

// Public route: Get all available buses
router.get("/buses", (req, res, next) => {
  logger.info("Request to get all available buses"); // Log info
  getBuses(req, res).catch(next); // Handle errors in controller
});

// Protected route: Get bus by ID
router.get("/buses/:id", verifyToken, (req, res, next) => {
  logger.info(`Request to get bus with ID: ${req.params.id}`); // Log info
  getBusById(req, res).catch(next); // Handle errors in controller
});

router.get("/buses/:bus_id/seat", verifyToken, (req, res, next) => {
  logger.info(`Request to get bus with ID: ${req.params.bus_id}`); // Log info
  getBookedSeatsByBusId(req, res).catch(next); // Handle errors in controller
});

// Public route: Get all cities
router.get("/cities", (req, res, next) => {
  logger.info("Request to get all cities"); // Log info
  getCities(req, res).catch(next); // Handle errors in controller
});

// Protected route: Create a new ticket
router.post("/ticket", verifyToken, (req, res, next) => {
  logger.info("Request to create a new ticket"); // Log info
  createTicket(req, res).catch(next); // Handle errors in controller
});

// Legacy route for backward compatibility
router.post("/book-ticket", verifyToken, (req, res, next) => {
  logger.info("Request to create a new ticket (legacy route)"); // Log info
  createTicket(req, res).catch(next); // Handle errors in controller
});

// Protected route: Get all tickets by user ID
router.get("/tickets/:user_id", verifyToken, (req, res, next) => {
  logger.info(`Request to get tickets for user ID: ${req.params.user_id}`); // Log info
  getTicketsByUserId(req, res).catch(next); // Handle errors in controller
});

module.exports = router;
