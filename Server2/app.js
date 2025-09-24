const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/authRoutes.js");
const menuRoutes = require("./routes/menuRoutes.js");
const foodOrderRoutes = require("./routes/foodOrderRoutes.js");
const logger = require("./config/logger");

const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const allowedOrigins = [
  "https://luxetravel.moongo.my.id",
  "https://www.luxetravel.moongo.my.id",
  "https://luxetravel-client.vercel.app",
  "http://localhost:3000", // untuk dev Next.js
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Jika origin ada di allowedOrigins atau request dari server langsung (no origin)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // biar cookies bisa dikirim
  })
);
app.use(express.json());

app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  console.log("Referer:", req.headers.referer);
  console.log("Host:", req.headers.host);
  next();
});

// Configure session for auth
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Middleware to log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Health check route
app.get("/", (req, res) => {
  logger.info("Health check request received.");
  res.send("running...");
});

app.use("/api/auth", authRoutes); // User Auth API
app.use("/api/food", menuRoutes, foodOrderRoutes); // Food API

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Food Ordering API running on port ${PORT}`);
  logger.info(`Food Ordering API running on port ${PORT}`);
  console.log(`AdminJS started on http://localhost:${PORT}/admin`);
});
