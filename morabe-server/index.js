const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { auditLoggerMiddleware } = require("./middleware/auditLoggerMiddleware");
const helmet = require("helmet");

dotenv.config();

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", "data:"],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: "sameorigin" }, // X-Frame-Options: SAMEORIGIN
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }, // Referrer-Policy
  }),
);

app.use(auditLoggerMiddleware);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/carts", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/v1/products", require("./routes/v1/productRoutes"));

app.get("/", (req, res) => {
  res.send("Bulldogs Exchange API is running");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong", error: err.message });
});

const corsOptions = {
  origin: "http://localhost:5000/",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Accept", "Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use((err, req, res, next) => {
  if (err instanceof require("multer").MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : err.message;

    return res.status(400).json({ success: false, message });
  }

  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Image upload failed.",
  });
});


const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch {
    console.error("Server was not started because MongoDB is unavailable.");
    process.exit(1);
  }
};

startServer();
