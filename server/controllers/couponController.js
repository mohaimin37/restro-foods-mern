import asyncHandler from "../middleware/asyncHandler.js";
import Coupon from "../models/Coupon.js";

const calculateDiscount = (coupon, subtotal) => {
  let discount =
    coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);
  return Number(discount.toFixed(2));
};

// @desc    Validate a coupon code against the current cart subtotal
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  const coupon = await Coupon.findOne({ code: code?.toUpperCase().trim() });

  if (!coupon || !coupon.isActive) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }
  if (coupon.expiryDate < new Date()) {
    res.status(400);
    throw new Error("This coupon has expired");
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("This coupon has reached its usage limit");
  }
  if (subtotal < coupon.minOrderValue) {
    res.status(400);
    throw new Error(`Minimum order value of Rs.${coupon.minOrderValue} required for this coupon`);
  }

  const discountAmount = calculateDiscount(coupon, subtotal);

  res.json({
    success: true,
    coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
    discountAmount,
  });
});

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json({ success: true, coupons });
});

// @desc    Create a coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, code: req.body.code?.toUpperCase().trim() });
  res.status(201).json({ success: true, coupon });
});

// @desc    Update a coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const payload = { ...req.body };
  if (payload.code) payload.code = payload.code.toUpperCase().trim();

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.json({ success: true, coupon });
});

// @desc    Delete a coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.json({ success: true, message: "Coupon removed" });
});
