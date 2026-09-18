import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaCalendarTimes, FaUsers, FaClock } from "react-icons/fa";
import Loader from "../components/Loader";
import { getMyReservations, cancelMyReservation } from "../api/reservationApi";

const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
  Completed: "bg-green-100 text-green-700",
};

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getMyReservations().then((data) => setReservations(data.reservations)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    try {
      await cancelMyReservation(id);
      toast.success("Reservation cancelled");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div className="container-app py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">My Reservations</h1>

      {reservations.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FaCalendarTimes size={48} className="mb-4 text-ink-300" />
          <p className="text-ink-500 dark:text-ink-400">You have no reservations yet.</p>
          <Link to="/reservation" className="btn-primary mt-6">Reserve a Table</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {reservations.map((r) => (
            <div key={r._id} className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className={`badge ${statusStyles[r.status]}`}>{r.status}</span>
                <span className="text-sm font-semibold text-ink-900 dark:text-white">
                  {format(new Date(r.date), "MMM d, yyyy")}
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-ink-600 dark:text-ink-300">
                <p className="flex items-center gap-2"><FaClock className="text-brand-500" /> {r.time}</p>
                <p className="flex items-center gap-2"><FaUsers className="text-brand-500" /> {r.guests} guests</p>
                {r.tableNumber && <p>Table #{r.tableNumber}</p>}
                {r.specialRequest && <p className="italic text-ink-400">"{r.specialRequest}"</p>}
              </div>
              {(r.status === "Pending" || r.status === "Confirmed") && (
                <button
                  onClick={() => handleCancel(r._id)}
                  className="btn-outline mt-4 w-full !py-2 text-sm text-red-600"
                >
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;
