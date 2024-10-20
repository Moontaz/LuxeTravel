const prisma = require("../db.js"); // Prisma instance

const logger = require("../config/logger"); // Import logger

// Get all food orders

const getFoodOrders = async (req, res) => {
  try {
    const response = await prisma.foodorder.findMany();

    logger.info("Fetched all food orders"); // Log info

    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error fetching food orders: ${error.message}`); // Log error

    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific food order by Ticket Code

const getFoodOrderByTicketCode = async (req, res) => {
  try {
    const response = await prisma.foodorder.findMany({
      where: { ticket_code: req.params.ticket_code },
    });

    if (response.length > 0) {
      const foodOrders = response.map((order) => {
        let parsedFoodItems;
        try {
          parsedFoodItems = JSON.parse(order.food_items); // Parse food_items to convert from string to object
        } catch (error) {
          logger.error(
            `Failed to parse food_items for order ${order.order_id}: ${error.message}`
          );
          parsedFoodItems = []; // Fallback to an empty array if parsing fails
        }

        // Log parsed food items
        logger.info(
          `Food Order with Ticket Code ${
            req.params.ticket_code
          }: ${JSON.stringify(parsedFoodItems, null, 2)}`
        );

        return {
          order_id: order.order_id,
          ticket_code: order.ticket_code,
          food_items: parsedFoodItems, // Send parsed food_items
          total_price: order.total_price,
          created_at: order.created_at,
        };
      });

      logger.info(
        `Fetched food orders for ticket code: ${req.params.ticket_code}`
      ); // Log info
      res.status(200).json(foodOrders); // Return the parsed response
    } else {
      logger.warn(
        `No food orders found for ticket code: ${req.params.ticket_code}`
      ); // Log warning
      res.status(404).json({ error: "No food orders found" });
    }
  } catch (error) {
    logger.error(`Error fetching food orders: ${error.message}`); // Log error
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create a new food order (ticket_code comes from client)

const createFoodOrder = async (req, res) => {
  const { ticket_code, food_items, total_price } = req.body;

  try {
    await prisma.foodorder.create({
      data: {
        ticket_code,

        food_items: JSON.stringify(food_items),

        total_price,
      },
    });

    logger.info(`Food order created for ticket code: ${ticket_code}`); // Log info

    res.status(201).json("Food Order Created");
  } catch (error) {
    logger.error(`Error creating food order: ${error.message}`); // Log error

    res.status(500).json({ error: "Server Error" });
  }
};

// Update a food order

const updateFoodOrder = async (req, res) => {
  const { ticket_code, food_items, total_price } = req.body;

  try {
    const updatedOrder = await prisma.foodorder.update({
      where: { order_id: parseInt(req.params.id) },

      data: {
        ticket_code,

        food_items: JSON.stringify(food_items),

        total_price,
      },
    });

    if (!updatedOrder) {
      logger.warn(`Food order not found for order ID: ${req.params.id}`); // Log warning

      res.status(404).json({ error: "Food order not found" });
    } else {
      logger.info(`Food order updated for order ID: ${req.params.id}`); // Log info

      res.status(200).json("Food Order Updated");
    }
  } catch (error) {
    logger.error(`Error updating food order: ${error.message}`); // Log error

    res.status(500).json({ error: "Server Error" });
  }
};

// Delete a food order

const deleteFoodOrder = async (req, res) => {
  try {
    const deletedOrder = await prisma.foodorder.delete({
      where: { order_id: parseInt(req.params.id) },
    });

    if (!deletedOrder) {
      logger.warn(`Food order not found for order ID: ${req.params.id}`); // Log warning

      res.status(404).json({ error: "Food order not found" });
    } else {
      logger.info(`Food order deleted for order ID: ${req.params.id}`); // Log info

      res.status(200).json("Food Order Deleted");
    }
  } catch (error) {
    logger.error(`Error deleting food order: ${error.message}`); // Log error

    res.status(500).json({ error: "Server Error" });
  }
};

// Export the functions

module.exports = {
  getFoodOrders,

  getFoodOrderByTicketCode,

  createFoodOrder,

  updateFoodOrder,

  deleteFoodOrder,
};
