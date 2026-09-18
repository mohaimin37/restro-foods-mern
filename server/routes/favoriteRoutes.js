import express from "express";
import { getMyFavorites, addFavorite, removeFavorite } from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyFavorites);
router.post("/:menuItemId", addFavorite);
router.delete("/:menuItemId", removeFavorite);

export default router;
