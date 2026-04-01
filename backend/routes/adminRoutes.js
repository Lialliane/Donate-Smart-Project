
import express from "express";
import {
  getPendingCases,
  approveCase,
  deleteCase,
  getAllUsers,
  getAnalytics,
  rejectCase
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/isAdmin.js";


const router = express.Router();

router.get("/pending-cases", verifyAdmin, getPendingCases);
router.put("/approve-case/:id", verifyAdmin, approveCase);
router.put("/reject-case/:id", verifyAdmin, rejectCase);
router.delete("/delete-case/:id", verifyAdmin, deleteCase);
router.get("/users", verifyAdmin, getAllUsers);
router.get("/analytics", verifyAdmin, getAnalytics);

export default router;
