
import Case from "../models/Case.js";
import { analyzeCase } from "../services/aiService.js";
export const addCase = async (req, res) => {
  try {
    const { title, description, category , goal } = req.body;
    console.log("Uploaded file:", req.file);
    

    const image = req.file ? req.file.filename : null;
  const { summary, error } = await analyzeCase({ title, description });
    const newCase = new Case({
      title,
      description,
      category,
      summary,
      image,
      goal,
      status: "pending",
      donations: 0,
      createdBy: req.user.id,
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const analyzeCaseController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if ( !description) {
      return res.status(400).json({ success: false, message: "Title and description required" });
    }

    const ai = await analyzeCase({ title, description });
    return res.status(200).json({ success: true, data: ai });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const getApprovedCases = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const cases = await Case.find({ status: "approved" })
      .sort({ updatedAt: -1 })
      .limit(limit);
    res.json(cases);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const getUserCases = async (req, res) => {
  try {
    const cases = await Case.find({ createdBy: req.user.id });
    res.json(cases);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

export const updateCaseDonations = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation amount." });
    }

    const updated = await Case.findByIdAndUpdate(
      req.params.id,
      { $inc: { donations: amount } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Case not found." });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const gerSimilar =  async (req, res) => {
  try {
    const current = await Case.findById(req.params.id);
    if (!current) return res.status(404).json({ message: "Case not found" });

    const similar = await Case.find({
      category: current.category,
      _id: { $ne: current._id },
      status: "approved"
    }).limit(3);

    res.json(similar);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

