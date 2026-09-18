import express from "express";
import {
  getReviewsForItem,
  createReview,
  deleteReview,
  getAllReviews,
} from "../controllers/reviewController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, authorize("admin"), getAllReviews);
router.get("/:menuItemId", getReviewsForItem);
router.post("/:menuItemId", protect, createReview);
router.delete("/:id", protect, deleteReview);

export default router;
