const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/authRoutes.js");
const busRoutes = require("./routes/busRoutes.js");
const logger = require("./config/logger");

const app = express();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const serverless = require("serverless-http");

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
  logger.info("Origin:", req.headers.origin);
  logger.info("Referer:", req.headers.referer);
  logger.info("Host:", req.headers.host);
  next();
});

// Configure session for auth
app.use(
  session({
    secret: "secretbanget",
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

app.use("/api/auth", authRoutes);
app.use("/api/bus", busRoutes);

// const PORT = process.env.PORT || 6000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`Bus Ticketing API running on port ${PORT}`);
logger.info(`Bus Ticketing API running`);
//   console.log(`AdminJS started on http://localhost:${PORT}/admin`);
// });
export default serverless(app);
