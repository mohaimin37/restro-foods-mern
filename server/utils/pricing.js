import Coupon from "../models/Coupon.js";

export const TAX_RATE = 0.05; // GST
export const DELIVERY_FEE = 49;
export const FREE_DELIVERY_THRESHOLD = 499;

const calculateDiscount = (coupon, subtotal) => {
  let discount =
    coupon.discountType === "percentage" ? (subtotal * coupon.discountValue) / 100 : coupon.discountValue;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return Math.min(discount, subtotal);
};

// Applies a coupon code (if provided and valid) to an itemsPrice subtotal and
// returns the full price breakdown. Throws if the coupon is invalid so callers
// can surface a 400 error consistently.
export const computeOrderPricing = async (itemsPrice, couponCode) => {
  let discountAmount = 0;
  let appliedCoupon = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
    if (!coupon || !coupon.isActive) throw new Error("Invalid coupon code");
    if (coupon.expiryDate < new Date()) throw new Error("This coupon has expired");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      throw new Error("This coupon has reached its usage limit");
    if (itemsPrice < coupon.minOrderValue)
      throw new Error(`Minimum order value of Rs.${coupon.minOrderValue} required for this coupon`);

    discountAmount = Number(calculateDiscount(coupon, itemsPrice).toFixed(2));
    appliedCoupon = coupon;
  }

  const discountedSubtotal = itemsPrice - discountAmount;
  const deliveryPrice = discountedSubtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const taxPrice = Number((discountedSubtotal * TAX_RATE).toFixed(2));
  const totalPrice = Number((discountedSubtotal + deliveryPrice + taxPrice).toFixed(2));

  return { discountAmount, deliveryPrice, taxPrice, totalPrice, appliedCoupon };
};

export const markCouponUsed = async (coupon) => {
  if (!coupon) return;
  coupon.usedCount += 1;
  await coupon.save();
};
