import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { getAllReservations, updateReservation } from "../../api/reservationApi";

const statusOptions = ["Pending", "Confirmed", "Cancelled", "Completed"];
const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
  Completed: "bg-green-100 text-green-700",
};

const ManageReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    getAllReservations().then((data) => setReservations(data.reservations)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleUpdate = async (id, patch) => {
    try {
      await updateReservation(id, patch);
      toast.success("Reservation updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Reservations</h1>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reservations.map((r) => (
          <div key={r._id} className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className={`badge ${statusStyles[r.status]}`}>{r.status}</span>
              <span className="text-sm font-semibold">{format(new Date(r.date), "MMM d, yyyy")}</span>
            </div>
            <p className="font-semibold text-ink-900 dark:text-white">{r.name}</p>
            <p className="text-sm text-ink-500">{r.email} · {r.phone}</p>
            <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">
              {r.time} · {r.guests} guests
            </p>
            {r.specialRequest && (
              <p className="mt-1 text-xs italic text-ink-400">"{r.specialRequest}"</p>
            )}

            <div className="mt-4 flex items-center gap-2">
              <select
                value={r.status}
                onChange={(e) => handleUpdate(r._id, { status: e.target.value })}
                className="input !w-auto flex-1 !py-1.5 text-xs"
              >
                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <input
                type="number"
                placeholder="Table #"
                defaultValue={r.tableNumber || ""}
                onBlur={(e) => e.target.value && handleUpdate(r._id, { tableNumber: Number(e.target.value) })}
                className="input !w-24 !py-1.5 text-xs"
              />
            </div>
          </div>
        ))}
        {reservations.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-500 dark:text-ink-400">No reservations found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageReservations;
