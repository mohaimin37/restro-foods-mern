import express from "express";
import {
  createCheckoutSession,
  verifyCheckoutSession,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/session/:sessionId", protect, verifyCheckoutSession);

export default router;
