import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { FaBoxOpen, FaArrowRight } from "react-icons/fa";
import Loader from "../components/Loader";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { getMyOrders } from "../api/orderApi";
import { formatPrice } from "../utils/format";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((data) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;

  return (
    <div className="container-app py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FaBoxOpen size={48} className="mb-4 text-ink-300" />
          <p className="text-ink-500 dark:text-ink-400">You haven't placed any orders yet.</p>
          <Link to="/menu" className="btn-primary mt-6">Order Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="card flex flex-col gap-3 p-5 transition hover:border-brand-300 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-ink-900 dark:text-white">
                  Order #{order._id.slice(-6).toUpperCase()}
                </p>
                <p className="text-sm text-ink-500 dark:text-ink-400">
                  {format(new Date(order.createdAt), "MMM d, yyyy • h:mm a")} · {order.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OrderStatusBadge status={order.status} />
                <span className="font-display font-bold text-ink-900 dark:text-white">
                  {formatPrice(order.totalPrice)}
                </span>
                <FaArrowRight className="text-ink-400" size={13} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
