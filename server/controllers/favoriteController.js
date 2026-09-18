import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";

// @desc    Get logged in user's favorite dishes
// @route   GET /api/favorites
// @access  Private
export const getMyFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.json({ success: true, favorites: user.favorites });
});

// @desc    Add a dish to favorites
// @route   POST /api/favorites/:menuItemId
// @access  Private
export const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { menuItemId } = req.params;

  if (!user.favorites.some((id) => id.toString() === menuItemId)) {
    user.favorites.push(menuItemId);
    await user.save();
  }

  res.json({ success: true, favorites: user.favorites });
});

// @desc    Remove a dish from favorites
// @route   DELETE /api/favorites/:menuItemId
// @access  Private
export const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { menuItemId } = req.params;

  user.favorites = user.favorites.filter((id) => id.toString() !== menuItemId);
  await user.save();

  res.json({ success: true, favorites: user.favorites });
});
