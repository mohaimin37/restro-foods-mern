import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import Loader from "../components/Loader";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { getOrderById } from "../api/orderApi";

const steps = ["Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderById(id)
      .then((data) => setOrder(data.order))
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader full />;
  if (!order) return null;

  const currentStep = steps.indexOf(order.status);

  return (
    <div className="container-app py-10">
      <Link to="/orders" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-brand-600">
        <FaArrowLeft size={12} /> Back to Orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">
            Order #{order._id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Placed on {format(new Date(order.createdAt), "MMM d, yyyy • h:mm a")}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status !== "Cancelled" && (
        <div className="card mb-8 p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center text-center">
                <div
                  className={`mb-2 h-3 w-3 rounded-full ${
                    i <= currentStep ? "bg-brand-600" : "bg-ink-200 dark:bg-ink-700"
                  }`}
                />
                <span className={`text-[11px] font-medium ${i <= currentStep ? "text-brand-600" : "text-ink-400"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-1 h-1 w-full rounded-full bg-ink-100 dark:bg-ink-800">
            <div
              className="h-1 rounded-full bg-brand-600 transition-all"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {order.items.map((item) => (
            <div key={item.menuItem} className="card flex items-center gap-4 p-4">
              <img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-semibold text-ink-900 dark:text-white">{item.name}</p>
                <p className="text-sm text-ink-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-ink-900 dark:text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="card p-5">
            <h3 className="mb-3 font-display font-bold text-ink-900 dark:text-white">Delivery Details</h3>
            <p className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-300">
              <FaMapMarkerAlt className="mt-0.5 shrink-0 text-brand-500" />
              {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="mt-2 flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
              <FaPhoneAlt className="text-brand-500" /> {order.shippingAddress.phone}
            </p>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 font-display font-bold text-ink-900 dark:text-white">Payment Summary</h3>
            <div className="space-y-2 text-sm text-ink-600 dark:text-ink-300">
              <div className="flex justify-between"><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>${order.deliveryPrice.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <div className="my-2 border-t border-dashed border-ink-200 dark:border-ink-700" />
              <div className="flex justify-between font-display text-base font-bold text-ink-900 dark:text-white">
                <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              {order.paymentMethod} · {order.isPaid ? "Paid" : "Payment pending"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
