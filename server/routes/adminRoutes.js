import express from "express";
import { getDashboardStats, getAllUsers, toggleUserActive } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/toggle-active", toggleUserActive);

export default router;
