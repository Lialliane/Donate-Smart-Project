import express from "express";
import { registerUser, loginUser, updateUser , getUser,deleteUser,disableUser } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyAdmin } from "../middleware/isAdmin.js";
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", verifyToken, updateUser);
router.get("/me", verifyToken, getUser);

// تعطيل/تفعيل المستخدم
router.patch("/:id/disable", verifyAdmin, disableUser);

// حذف المستخدم
router.delete("/:id", verifyAdmin, deleteUser);

export default router;
