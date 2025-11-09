// routes/results.js
import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import crypto from "crypto";

const router = express.Router();
let results = []; // dev store; use DB in prod

// All subsequent routes in this router require authentication
// The requireAuth middleware will run before any route handler below
router.use(requireAuth);

// POST /api/results/save
router.post("/save", (req, res) => {
  // Destructure and validate input types
  const { stressScore, cohesion, convergenceTime } = req.body;
  if (typeof stressScore !== "number" || typeof cohesion !== "number" || typeof convergenceTime !== "number") {
    return res.status(400).json({ error: "Invalid input types" });
  }

  // req.user is available here because requireAuth ran successfully
  const entry = {
    id: crypto.randomUUID(),
    userId: req.user.id, // 👈 Link result to the authenticated user's ID
    stressScore,
    cohesion,
    convergenceTime,
    timestamp: new Date().toISOString(),
  };
  results.push(entry);
  res.status(201).json({ message: "Saved", entry });
});

// GET /api/results/all
router.get("/all", (req, res) => {
  // Only return results belonging to the authenticated user
  const userResults = results.filter((r) => r.userId === req.user.id);
  res.json(userResults);
});

// Optional: DELETE /api/results/:id
router.delete("/:id", (req, res) => {
  // Find index of result, ensuring it belongs to the authenticated user
  const idx = results.findIndex((r) => r.id === req.params.id && r.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ error: "Not found or unauthorized" });
  
  results.splice(idx, 1);
  res.json({ message: "Deleted" });
});

export default router;