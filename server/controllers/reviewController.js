import asyncHandler from "../middleware/asyncHandler.js";
import Review from "../models/Review.js";
import MenuItem from "../models/MenuItem.js";

const recalcMenuItemRating = async (menuItemId) => {
  const stats = await Review.aggregate([
    { $match: { menuItem: menuItemId } },
    { $group: { _id: "$menuItem", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  await MenuItem.findByIdAndUpdate(menuItemId, {
    rating: stats[0]?.avgRating || 0,
    numReviews: stats[0]?.count || 0,
  });
};

// @desc    Get reviews for a menu item
// @route   GET /api/reviews/:menuItemId
// @access  Public
export const getReviewsForItem = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ menuItem: req.params.menuItemId })
    .populate("user", "name avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

// @desc    Create a review for a menu item
// @route   POST /api/reviews/:menuItemId
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const menuItemId = req.params.menuItemId;

  const menuItem = await MenuItem.findById(menuItemId);
  if (!menuItem) {
    res.status(404);
    throw new Error("Menu item not found");
  }

  const alreadyReviewed = await Review.findOne({ user: req.user._id, menuItem: menuItemId });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You have already reviewed this dish");
  }

  const review = await Review.create({
    user: req.user._id,
    menuItem: menuItemId,
    rating,
    comment,
  });

  await recalcMenuItemRating(menuItemId);

  const populated = await review.populate("user", "name avatar");
  res.status(201).json({ success: true, review: populated });
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  const menuItemId = review.menuItem;
  await review.deleteOne();
  await recalcMenuItemRating(menuItemId);

  res.json({ success: true, message: "Review removed" });
});

// @desc    Get all reviews (admin)
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate("user", "name email")
    .populate("menuItem", "name image")
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});
