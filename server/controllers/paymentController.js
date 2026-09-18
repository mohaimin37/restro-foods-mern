import Stripe from "stripe";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TAX_RATE = 0.05; // GST
const DELIVERY_FEE = 49;
const FREE_DELIVERY_THRESHOLD = 499;

// @desc    Create a Stripe Checkout session and a pending order
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

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
    paymentMethod: "Stripe",
    itemsPrice,
    taxPrice,
    deliveryPrice,
    totalPrice,
    isPaid: false,
    status: "Pending",
  });

  const line_items = orderItems.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: { name: item.name, images: [item.image] },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  if (taxPrice > 0) {
    line_items.push({
      price_data: { currency: "inr", product_data: { name: "Tax" }, unit_amount: Math.round(taxPrice * 100) },
      quantity: 1,
    });
  }
  if (deliveryPrice > 0) {
    line_items.push({
      price_data: { currency: "inr", product_data: { name: "Delivery Fee" }, unit_amount: Math.round(deliveryPrice * 100) },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    customer_email: req.user.email,
    metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
    success_url: `${process.env.CLIENT_URL}/order-success/${order._id}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/checkout`,
  });

  res.json({ success: true, url: session.url, orderId: order._id });
});

// @desc    Stripe webhook - confirm payment
// @route   POST /api/payments/webhook
// @access  Public (verified via Stripe signature)
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = "Confirmed";
        order.paymentResult = {
          id: session.id,
          status: session.payment_status,
          updateTime: new Date().toISOString(),
          email: session.customer_email,
        };
        await order.save();
      }
    }
  }

  res.json({ received: true });
});

// @desc    Verify a checkout session (used by the success page as a fallback to webhook)
// @route   GET /api/payments/session/:sessionId
// @access  Private
export const verifyCheckoutSession = asyncHandler(async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

  if (session.payment_status === "paid" && session.metadata?.orderId) {
    const order = await Order.findById(session.metadata.orderId);
    if (order && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = "Confirmed";
      order.paymentResult = {
        id: session.id,
        status: session.payment_status,
        updateTime: new Date().toISOString(),
        email: session.customer_email,
      };
      await order.save();
    }
  }

  res.json({ success: true, paymentStatus: session.payment_status });
});

