import express from "express";
import {
  getMenuItems,
  getFeaturedItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getMenuItems);
router.get("/featured", getFeaturedItems);
router.get("/:id", getMenuItemById);
router.post("/", protect, authorize("admin"), createMenuItem);
router.put("/:id", protect, authorize("admin"), updateMenuItem);
router.delete("/:id", protect, authorize("admin"), deleteMenuItem);

export default router;
