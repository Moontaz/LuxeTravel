const prisma = require("../db.js"); // Import Prisma Client
const logger = require("../config/logger"); // Import logger

// Function to get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await prisma.buses.findMany({
      include: {
        route: {
          include: {
            departure_city: { select: { city_name: true } },
            arrival_city: { select: { city_name: true } },
          },
        },
      },
    });

    const formattedBuses = buses.map((bus) => ({
      id: bus.bus_id,
      name: bus.bus_name,
      departureTime: bus.departure_time,
      origin: bus.route?.departure_city?.city_name || null,
      destination: bus.route?.arrival_city?.city_name || null,
      price: bus.price,
      available_seat: bus.available_seats,
      seat_capacity: bus.seat_capacity,
    }));

    logger.info("Successfully fetched all buses");
    res.status(200).json(formattedBuses);
  } catch (error) {
    logger.error(`Error fetching buses: ${error.stack}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get bus by ID
exports.getBusById = async (req, res) => {
  try {
    const bus = await prisma.buses.findUnique({
      where: { bus_id: parseInt(req.params.id) },
    });

    if (!bus) {
      logger.warn(`Bus not found with ID: ${req.params.id}`);
      return res.status(404).json({ error: "Bus not found" });
    }

    logger.info(`Successfully fetched bus with ID: ${req.params.id}`);
    res.status(200).json(bus);
  } catch (error) {
    logger.error(`Error fetching bus by ID: ${error.stack}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to get all cities
exports.getCities = async (req, res) => {
  try {
    const cities = await prisma.cities.findMany();
    logger.info("Successfully fetched all cities");
    res.status(200).json(cities);
  } catch (error) {
    logger.error(`Error fetching cities: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Function to create a new ticket
exports.createTicket = async (req, res) => {
  try {
    // Check for auth token first
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("No token provided in createTicket request");
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first.",
      });
    }

    const {
      user_id,
      bus_id,
      no_seat,
      total_price,
      date,
      bus_name,
      departure_city,
      arrival_city, // Changed from destination_city to arrival_city
      has_addons,
    } = req.body;

    // Validate required fields according to Supabase schema
    if (
      !user_id ||
      !bus_id ||
      !no_seat ||
      !total_price ||
      !date ||
      !bus_name ||
      !departure_city ||
      !arrival_city
    ) {
      logger.warn(
        `Missing required fields in createTicket: user_id=${user_id}, bus_id=${bus_id}, no_seat=${no_seat}, total_price=${total_price}, date=${date}, bus_name=${bus_name}, departure_city=${departure_city}, arrival_city=${arrival_city}`
      );
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: user_id, bus_id, no_seat, total_price, date, bus_name, departure_city, arrival_city",
      });
    }

    logger.info(
      `Attempting to create ticket for bus_id: ${bus_id}, user_id: ${user_id}`
    );

    // Check if bus exists
    const bus = await prisma.buses.findUnique({
      where: { bus_id: parseInt(bus_id) },
    });

    if (!bus) {
      logger.warn(`Bus with id ${bus_id} not found`);
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Check for duplicate ticket (same user, bus, and seat)
    const existingTicket = await prisma.tickets.findFirst({
      where: {
        user_id: parseInt(user_id),
        bus_id: parseInt(bus_id),
        no_seat: String(no_seat),
      },
    });

    if (existingTicket) {
      logger.warn(
        `Duplicate ticket found for user ${user_id}, bus ${bus_id}, seat ${no_seat}`
      );
      return res.status(409).json({
        success: false,
        message: "Ticket already exists for this user, bus, and seat",
        existing_ticket: existingTicket,
      });
    }

    // Generate randomized ticket code
    const ticket_code = `LUX-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;

    logger.info(`Generated ticket code: ${ticket_code}`);

    // Skip food order check if has_addons is false for efficiency
    if (has_addons === false) {
      logger.info(
        `Skipping food order check for ticket ${ticket_code} - no addons`
      );
    }

    // Create ticket with all required fields according to Supabase schema
    const newTicket = await prisma.tickets.create({
      data: {
        user_id: Number(user_id),
        bus_id: Number(bus_id),
        no_seat: String(no_seat), // Ensure string
        total_price: Number(total_price),
        ticket_code,
        date: new Date(date), // Required field - not null
        bus_name: String(bus_name), // Required field - not null, ensure string
        departure_city: String(departure_city), // Required field - not null, ensure string
        arrival_city: String(arrival_city), // Required field - not null, ensure string
        has_addons: Boolean(has_addons) || false, // Default to false if not provided
      },
    });

    logger.info(`New ticket created with ticket code: ${ticket_code}`);
    res.status(201).json({
      success: true,
      ticket: newTicket,
      message: "Ticket created successfully",
    });
  } catch (error) {
    logger.error(
      `Prisma error in createTicket: ${error.message}`,
      error.meta || error
    );
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Function to get all tickets by user_id
exports.getTicketsByUserId = async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Check for auth token first
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("No token provided in getTicketsByUserId request");
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login first.",
      });
    }

    logger.info(`Fetching tickets for user ID: ${userId}`);

    const tickets = await prisma.tickets.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: "desc" },
      select: {
        ticket_id: true,
        user_id: true,
        bus_id: true,
        no_seat: true,
        total_price: true,
        ticket_code: true,
        created_at: true,
        departure_city: true,
        arrival_city: true,
        bus_name: true,
        has_addons: true,
        date: true,
        bus: {
          select: {
            bus_name: true,
            departure_time: true,
            price: true,
            route: {
              select: {
                departure_city: { select: { city_name: true } },
                arrival_city: { select: { city_name: true } },
              },
            },
          },
        },
      },
    });

    // Format tickets to include all fields with null handling
    const formattedTickets = tickets.map((ticket) => {
      // Get bus details from relation
      const busName = ticket.bus_name || ticket.bus?.bus_name || "Unknown Bus";
      const departureTime = ticket.bus?.departure_time || null;
      const busPrice = ticket.bus?.price || 0;

      // Get city details from relation
      const departureCityName =
        ticket.departure_city ||
        ticket.bus?.route?.departure_city?.city_name ||
        "Unknown";
      const arrivalCityName =
        ticket.arrival_city ||
        ticket.bus?.route?.arrival_city?.city_name ||
        "Unknown";

      return {
        ticket_id: ticket.ticket_id,
        user_id: ticket.user_id,
        bus_id: ticket.bus_id,
        no_seat: ticket.no_seat,
        total_price: ticket.total_price,
        ticket_code: ticket.ticket_code,
        created_at: ticket.created_at,
        departure_city: departureCityName,
        arrival_city: arrivalCityName,
        bus_name: busName,
        has_addons: ticket.has_addons || false,
        date: ticket.date || new Date(),
        // Additional bus details for display
        bus_details: {
          bus_name: busName,
          departure_time: departureTime,
          price: busPrice,
          route: {
            departure_city:
              ticket.bus?.route?.departure_city?.city_name || departureCityName,
            arrival_city:
              ticket.bus?.route?.arrival_city?.city_name || arrivalCityName,
          },
        },
        bus: ticket.bus,
      };
    });

    logger.info(
      `Successfully fetched ${tickets.length} tickets for user ID: ${userId}`
    );
    res.status(200).json(formattedTickets);
  } catch (error) {
    // Check if it's a Prisma schema error
    if (error.message && error.message.includes("does not exist")) {
      logger.error(
        `Prisma schema error in getTicketsByUserId: ${error.message}`,
        error.meta || error
      );
      return res.status(500).json({
        success: false,
        message:
          "Database schema is out of sync. Please run migration to add missing columns.",
        error: "DB_SCHEMA_MISMATCH",
      });
    }

    // Check if it's a null value error
    if (error.message && error.message.includes("null")) {
      logger.error(
        `Prisma null value error in getTicketsByUserId: ${error.message}`,
        error.meta || error
      );
      return res.status(500).json({
        success: false,
        message:
          "Database contains invalid null values. Please contact administrator.",
        error: "DB_NULL_VALUE_ERROR",
      });
    }

    logger.error(
      `Prisma error in getTicketsByUserId: ${error.message}`,
      error.meta || error
    );
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Function to get ticket by ticket_id
exports.getTicketById = async (req, res) => {
  const ticketId = req.params.ticket_id;

  try {
    const ticket = await prisma.tickets.findUnique({
      where: { ticket_id: parseInt(ticketId) },
      include: {
        bus: {
          select: {
            bus_name: true,
            departure_time: true,
            price: true,
          },
        },
      },
    });

    if (!ticket) {
      logger.warn(`Ticket not found with ID: ${ticketId}`);
      return res.status(404).json({ error: "Ticket not found" });
    }

    logger.info(`Successfully fetched ticket with ID: ${ticketId}`);
    res.status(200).json(ticket);
  } catch (error) {
    logger.error(`Error fetching ticket: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getBookedSeatsByBusId = async (req, res) => {
  const { bus_id } = req.params;

  try {
    // Ensure bus_id is a number
    const busId = parseInt(bus_id, 10);
    if (isNaN(busId)) {
      return res.status(400).json({ error: "Invalid bus_id parameter" });
    }

    // Fetch all tickets where the bus_id matches
    const tickets = await prisma.tickets.findMany({
      where: { bus_id: busId },
      select: { no_seat: true }, // Only select the 'no_seat' field
    });

    // Extract the seat numbers from the tickets
    const bookedSeats = tickets.map((ticket) => ticket.no_seat);

    // Log and send response
    logger.info(`Successfully fetched booked seats for bus ID: ${busId}`);
    res.status(200).json({ bookedSeats });
  } catch (error) {
    logger.error(
      `Error fetching booked seats for bus ID ${bus_id}: ${error.message}`
    );
    res
      .status(500)
      .json({ error: "Failed to fetch booked seats. Please try again." });
  }
};

// Function to delete ticket by ticket code
exports.deleteTicketByCode = async (req, res) => {
  const { ticket_code } = req.params;

  try {
    const ticket = await prisma.tickets.findFirst({
      where: { ticket_code: ticket_code },
    });

    if (!ticket) {
      logger.warn(`Ticket not found: ${ticket_code}`);
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    await prisma.tickets.delete({
      where: { ticket_id: ticket.ticket_id },
    });

    logger.info(`Ticket deleted: ${ticket_code}`);
    res
      .status(200)
      .json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting ticket: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
