import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaCheckCircle } from "react-icons/fa";
import Loader from "../components/Loader";
import { verifyCheckoutSession } from "../api/paymentApi";
import { getOrderById } from "../api/orderApi";
import { clearCart } from "../features/cart/cartSlice";
import { formatPrice } from "../utils/format";

const OrderSuccess = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const dispatch = useDispatch();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        if (sessionId) {
          await verifyCheckoutSession(sessionId);
        }
        const { order } = await getOrderById(id);
        setOrder(order);
        dispatch(clearCart());
      } catch {
        // order lookup can fail if navigated here directly; page still shows a generic success state
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [id, sessionId, dispatch]);

  if (loading) return <Loader full label="Confirming your order..." />;

  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <FaCheckCircle className="mb-5 text-green-500" size={64} />
      <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
        Order Placed Successfully!
      </h1>
      <p className="mt-2 max-w-md text-ink-500 dark:text-ink-400">
        Thank you{order?.user?.name ? `, ${order.user.name}` : ""}! Your order
        {order ? ` #${order._id.slice(-6).toUpperCase()}` : ""} has been confirmed and is being prepared.
      </p>
      {order && (
        <div className="card mt-8 w-full max-w-sm p-6 text-left">
          <div className="flex justify-between text-sm text-ink-600 dark:text-ink-300">
            <span>Payment Method</span><span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div className="mt-2 flex justify-between text-sm text-ink-600 dark:text-ink-300">
            <span>Status</span><span className="font-medium">{order.status}</span>
          </div>
          <div className="mt-2 flex justify-between font-display font-bold text-ink-900 dark:text-white">
            <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      )}
      <div className="mt-8 flex gap-3">
        <Link to="/orders" className="btn-outline">View My Orders</Link>
        <Link to="/menu" className="btn-primary">Order More Food</Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
