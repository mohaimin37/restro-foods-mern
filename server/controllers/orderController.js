import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

const TAX_RATE = 0.08;
const DELIVERY_FEE = 3.99;
const FREE_DELIVERY_THRESHOLD = 40;

// @desc    Create new order (used for Cash on Delivery; Stripe orders are created after payment confirmation)
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items provided");
  }

  const dbItems = await MenuItem.find({ _id: { $in: items.map((i) => i.menuItem) } });

  let itemsPrice = 0;
  const orderItems = items.map((i) => {
    const dbItem = dbItems.find((d) => d._id.toString() === i.menuItem);
    if (!dbItem || !dbItem.isAvailable) {
      res.status(400);
      throw new Error(`Item unavailable: ${i.name || i.menuItem}`);
    }
    itemsPrice += dbItem.price * i.quantity;
    return {
      menuItem: dbItem._id,
      name: dbItem.name,
      image: dbItem.image,
      price: dbItem.price,
      quantity: i.quantity,
    };
  });

  const deliveryPrice = itemsPrice >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
  const totalPrice = Number((itemsPrice + deliveryPrice + taxPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || "CashOnDelivery",
    itemsPrice,
    taxPrice,
    deliveryPrice,
    totalPrice,
    isPaid: paymentMethod === "CashOnDelivery" ? false : false,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }

  res.json({ success: true, order });
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const orders = await Order.find(query).populate("user", "name email").sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = req.body.status || order.status;
  if (order.status === "Delivered") {
    order.deliveredAt = new Date();
  }

  const updated = await order.save();
  res.json({ success: true, order: updated });
});
