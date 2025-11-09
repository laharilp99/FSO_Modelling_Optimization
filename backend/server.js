// server.js
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"; // Ensure this is imported once
import helmet from "helmet"; 
import rateLimit from "express-rate-limit"; 
import authRouter from "./routes/auth.js";
import resultsRouter from "./routes/results.js";

dotenv.config();
const app = express();

// --- Security and Utility Middleware ---

// Basic Security Headers
app.use(helmet());

// Simple Rate Limiting to prevent brute-force/DoS attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// 🛑 CORS Configuration (The FIX for credentials/wildcard error)
// If credentials (cookies) are included, the origin MUST be explicitly set, not '*'.
const allowedOrigin = process.env.NODE_ENV === "production" 
  ? process.env.FRONTEND_ORIGIN // Use specific origin in prod
  : "http://localhost:3000"; // 👈 Use the explicit frontend URL in dev

app.use(cors({
  origin: allowedOrigin,
  credentials: true, // 👈 Critical for httpOnly cookie exchange
}));


// --- Core Middleware ---
app.use(express.json()); // Body parser for JSON
app.use(cookieParser()); // Cookie parser

// --- Routes ---
app.use("/api/auth", authRouter);
app.use("/api/results", resultsRouter);

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack); // Log full stack for debugging
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));