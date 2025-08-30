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

// AdminJS
(async () => {
  try {
    const AdminJS = (await import("adminjs")).default;
    const AdminJSExpress = await import("@adminjs/express");
    const { Resource, Database, getModelByName } = await import(
      "@adminjs/prisma"
    );

    // Register Prisma adapter with AdminJS
    AdminJS.registerAdapter({ Resource, Database });

    // AdminJS setup with Prisma resources
    const adminJs = new AdminJS({
      resources: [
        {
          resource: { model: getModelByName("menu"), client: prisma },
          options: { navigation: { name: "Menu", icon: "RestaurantMenu" } },
        },
        {
          resource: { model: getModelByName("foodorder"), client: prisma },
          options: { navigation: { name: "Order", icon: "ShoppingCart" } },
        },
        {
          resource: { model: getModelByName("users"), client: prisma },
          options: { navigation: { name: "User", icon: "User" } },
        },
      ],
      rootPath: "/admin",
    });

    const ADMIN = {
      email: "contoh@contoh.com",
      password: await bcrypt.hash("inicumancontoh", 10),
    };

    // AdminJS router
    const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
      authenticate: async (email, password) => {
        if (
          email === ADMIN.email &&
          (await bcrypt.compare(password, ADMIN.password))
        ) {
          return ADMIN;
        }
        return null;
      },
      cookieName: "adminjs",
      cookiePassword: "session-secret-password",
    });

    // Use AdminJS router with auth
    app.use(adminJs.options.rootPath, adminRouter);

    console.log("AdminJS is running on /admin");
  } catch (error) {
    console.error("Error setting up AdminJS:", error);
  }
})();

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Food Ordering API running on port ${PORT}`);
  logger.info(`Food Ordering API running on port ${PORT}`);
  console.log(`AdminJS started on http://localhost:${PORT}/admin`);
});
