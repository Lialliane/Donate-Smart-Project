import express from "express";
import { analyzeCase } from "../services/aiService.js";

const router = express.Router();

// POST /api/ai/summarize
router.post("/summarize", async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: "Title and description are required." });
  }

  const result = await analyzeCase({ title, description });
  return res.json({ success: true, data: result });
});

export default router;
