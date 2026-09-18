import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaClock, FaUsers, FaPhoneAlt, FaEnvelope, FaUser } from "react-icons/fa";
import { createReservation } from "../api/reservationApi";

const timeSlots = ["12:00 PM", "1:00 PM", "2:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

const Reservation = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    date: "",
    time: "",
    guests: 2,
    specialRequest: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.time) {
      toast.error("Please select a time slot");
      return;
    }
    setSubmitting(true);
    try {
      await createReservation(form);
      toast.success("Table reserved successfully!");
      navigate("/my-reservations");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="container-app max-w-2xl py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Reserve a Table</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          Book your spot for a memorable dining experience
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label"><FaUser className="mr-1 inline" size={12} /> Full Name</label>
            <input name="name" required value={form.name} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label"><FaPhoneAlt className="mr-1 inline" size={12} /> Phone</label>
            <input name="phone" required value={form.phone} onChange={handleChange} className="input" />
          </div>
        </div>

        <div>
          <label className="label"><FaEnvelope className="mr-1 inline" size={12} /> Email</label>
          <input type="email" name="email" required value={form.email} onChange={handleChange} className="input" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label"><FaCalendarAlt className="mr-1 inline" size={12} /> Date</label>
            <input type="date" name="date" min={today} required value={form.date} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label"><FaUsers className="mr-1 inline" size={12} /> Guests</label>
            <input type="number" name="guests" min={1} max={20} required value={form.guests} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label"><FaClock className="mr-1 inline" size={12} /> Time</label>
            <select name="time" required value={form.time} onChange={handleChange} className="input">
              <option value="">Select</option>
              {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Special Request (optional)</label>
          <textarea
            name="specialRequest"
            value={form.specialRequest}
            onChange={handleChange}
            rows={3}
            className="input resize-none"
            placeholder="Birthday celebration, window seat, allergies, etc."
          />
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Booking..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
};

export default Reservation;
