// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function requireAuth(req, res, next) {
  try {
    // 1. Check for cookie (preferred for web/browser clients)
    let token = req.cookies?.authToken;

    // 2. Fall back to Authorization header (standard for API/mobile clients)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        // Extract token from "Bearer <token>"
        token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // Verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user payload to the request object
    req.user = payload;
    
    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    // Token is invalid, expired, or another error occurred
    console.error("Auth Error:", err.message);
    // Clear cookie on failure to force re-login (optional, but good practice)
    res.clearCookie("authToken", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" });
    return res.status(401).json({ error: "Unauthorized" });
  }
}