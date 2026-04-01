import express from "express";
import { addCase, getApprovedCases,getUserCases , updateCaseDonations, gerSimilar  } from "../controllers/caseController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import Case from "../models/Case.js";
import upload from "../middleware/upload.js";
const router = express.Router();
router.post("/", verifyToken,upload.single("image"), addCase);
router.get("/my-cases", verifyToken, getUserCases);
router.get("/", getApprovedCases);
router.get("/:id", async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id);
    res.json(singleCase);
  } catch (err) {
    res.status(500).json(err.message);
  }
});
router.patch("/:id/donate", updateCaseDonations);
router.get("/:id/similar", gerSimilar);


export default router;
