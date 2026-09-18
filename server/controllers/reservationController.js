import asyncHandler from "../middleware/asyncHandler.js";
import Reservation from "../models/Reservation.js";

// @desc    Create a table reservation
// @route   POST /api/reservations
// @access  Private
export const createReservation = asyncHandler(async (req, res) => {
  const { name, phone, email, date, time, guests, specialRequest } = req.body;

  const reservation = await Reservation.create({
    user: req.user._id,
    name,
    phone,
    email,
    date,
    time,
    guests,
    specialRequest,
  });

  res.status(201).json({ success: true, reservation });
});

// @desc    Get logged in user's reservations
// @route   GET /api/reservations/my
// @access  Private
export const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ success: true, reservations });
});

// @desc    Cancel own reservation
// @route   PUT /api/reservations/:id/cancel
// @access  Private
export const cancelMyReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }
  if (reservation.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  reservation.status = "Cancelled";
  await reservation.save();
  res.json({ success: true, reservation });
});

// @desc    Get all reservations (admin)
// @route   GET /api/reservations
// @access  Private/Admin
export const getAllReservations = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const reservations = await Reservation.find(query).sort({ date: -1 });
  res.json({ success: true, reservations });
});

// @desc    Update reservation status/table (admin)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
export const updateReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) {
    res.status(404);
    throw new Error("Reservation not found");
  }
  reservation.status = req.body.status ?? reservation.status;
  reservation.tableNumber = req.body.tableNumber ?? reservation.tableNumber;
  await reservation.save();
  res.json({ success: true, reservation });
});
