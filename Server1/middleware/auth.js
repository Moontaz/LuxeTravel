const jwt = require("jsonwebtoken");
const logger = require("../config/logger"); // Import the logger

const SECRET_KEY = process.env.JWT_SECRET || "fallback_secret"; // Use environment variable

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Log the incoming request details for debugging
  logger.info(
    `Auth middleware - Authorization header: ${
      authHeader ? "Present" : "Missing"
    }`
  );

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("No valid Bearer token provided in Authorization header");
    return res.status(401).json({
      success: false,
      message: "No valid token provided. Please login first.",
    });
  }

  const token = authHeader.split(" ")[1]; // Extract Bearer token
  logger.info(
    `Extracted token: ${token ? token.substring(0, 20) + "..." : "null"}`
  );

  if (!token) {
    logger.warn("No token found after Bearer prefix");
    return res.status(401).json({
      success: false,
      message: "No token provided. Please login first.",
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      logger.error(`Failed to authenticate token: ${err.message}`);
      logger.error(`Token verification error details: ${JSON.stringify(err)}`);
      logger.error(`Token being verified: ${token.substring(0, 50)}...`);
      logger.error(`SECRET_KEY being used: ${SECRET_KEY.substring(0, 10)}...`);

      // Check if token is expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }

      // Check if token is malformed
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token format. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    // Save user ID for use in other routes
    req.userId = decoded.id;
    logger.info(`User ID ${req.userId} authenticated successfully`);
    logger.info(`Decoded token payload: ${JSON.stringify(decoded)}`);
    next();
  });
};

module.exports = verifyToken;
