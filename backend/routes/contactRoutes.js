
import express from "express";
import { submitContact } from "../controllers/contactController.js";
 import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, submitContact);

export default router;
