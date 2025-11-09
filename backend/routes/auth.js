// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// In-memory user store for dev — replace with DB in production
const users = []; // { id, email, passwordHash }

// helper
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Missing fields" });

    if (users.find((u) => u.email === email)) return res.status(400).json({ error: "User exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    // Create and store user
    const user = { id: Date.now().toString(), email, passwordHash: hash };
    users.push(user);

    return res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken({ id: user.id, email: user.email });

    // Set httpOnly cookie for security (prevents XSS access)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
      sameSite: "lax", // good balance of security and usability
      maxAge: 1000 * 60 * 15, // 15 minutes in milliseconds
    });

    return res.json({ message: "Logged in" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  // Clear the authentication cookie
  res.clearCookie("authToken", { 
    httpOnly: true, 
    sameSite: "lax", 
    secure: process.env.NODE_ENV === "production" 
  });
  res.json({ message: "Logged out" });
});

// GET /api/auth/me
// Checks if the user has a valid token and returns their status
router.get("/me", (req, res) => {
  const token = req.cookies?.authToken;
  if (!token) return res.status(200).json({ authenticated: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Return authenticated status and safe user data from the payload
    return res.json({ authenticated: true, user: { id: payload.id, email: payload.email } });
  } catch (err) {
    // Token is expired or invalid
    return res.status(200).json({ authenticated: false });
  }
});

export default router;