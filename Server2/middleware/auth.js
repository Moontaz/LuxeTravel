const jwt = require("jsonwebtoken");
const logger = require("../config/logger"); // Impor logger

const SECRET_KEY = "inibuatpesenmakanan"; // Sebaiknya gunakan variabel lingkungan untuk kunci rahasia

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
  if (!token) {
    logger.warn("No token provided"); // Log warning
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.error(`Failed to authenticate token: ${err.message}`); // Log error
      return res.status(500).json({ message: "Failed to authenticate token" });
    }

    // Save user ID for use in other routes
    req.userId = decoded.id;
    logger.info(`User ID ${req.userId} authenticated successfully`); // Log info
    next();
  });
};

module.exports = verifyToken;
