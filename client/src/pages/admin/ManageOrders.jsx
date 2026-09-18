import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { getAllOrders, updateOrderStatus } from "../../api/orderApi";
import { formatPrice } from "../../utils/format";

const statusOptions = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const load = () =>
    getAllOrders(filter ? { status: filter } : {}).then((data) => setOrders(data.orders)).finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input !w-auto">
          <option value="">All Statuses</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <th className="p-4">Order ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Date</th>
              <th className="p-4">Total</th>
              <th className="p-4">Paid</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-ink-50 dark:border-ink-800/50">
                <td className="p-4 font-mono text-xs">{order._id.slice(-6).toUpperCase()}</td>
                <td className="p-4">
                  <p className="font-medium text-ink-800 dark:text-ink-100">{order.user?.name}</p>
                  <p className="text-xs text-ink-400">{order.user?.email}</p>
                </td>
                <td className="p-4">{format(new Date(order.createdAt), "MMM d, h:mm a")}</td>
                <td className="p-4 font-semibold">{formatPrice(order.totalPrice)}</td>
                <td className="p-4">
                  <span className={`badge ${order.isPaid ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </td>
                <td className="p-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="input !w-auto !py-1.5 text-xs"
                  >
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
