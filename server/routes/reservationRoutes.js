import express from "express";
import {
  createReservation,
  getMyReservations,
  cancelMyReservation,
  getAllReservations,
  updateReservation,
} from "../controllers/reservationController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createReservation);
router.get("/my", protect, getMyReservations);
router.put("/:id/cancel", protect, cancelMyReservation);
router.get("/", protect, authorize("admin"), getAllReservations);
router.put("/:id", protect, authorize("admin"), updateReservation);

export default router;
