const prisma = require("../db.js"); // Prisma instance
const logger = require("../config/logger"); // Import logger

const getMenu = async (req, res) => {
  try {
    const response = await prisma.menu.findMany(); // Prisma query to fetch all menu items
    logger.info("Successfully fetched menu"); // Log info
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error fetching menu: ${error.message}`); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Export the function
module.exports = { getMenu };
