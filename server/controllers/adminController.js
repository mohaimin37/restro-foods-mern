import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import MenuItem from "../models/MenuItem.js";
import Reservation from "../models/Reservation.js";

// @desc    Get dashboard summary stats + charts data
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalMenuItems, totalOrders, pendingReservations] = await Promise.all([
    User.countDocuments({ role: "user" }),
    MenuItem.countDocuments(),
    Order.countDocuments(),
    Reservation.countDocuments({ status: "Pending" }),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const salesByDay = await Order.aggregate([
    { $match: { isPaid: true, createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$totalPrice" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const topDishes = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.menuItem",
        name: { $first: "$items.name" },
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalMenuItems,
      totalOrders,
      pendingReservations,
      totalRevenue,
    },
    salesByDay,
    ordersByStatus,
    topDishes,
  });
});

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// @desc    Toggle a user's active status (admin)
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Private/Admin
export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, user });
});
