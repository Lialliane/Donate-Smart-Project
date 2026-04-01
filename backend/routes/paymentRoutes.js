import { checkout , webhook, getSession } from "../controllers/paymentController.js";
import express from "express";

const router = express.Router();

router.post("/checkout", checkout);

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

router.get("/session/:id", getSession);


export default router;
