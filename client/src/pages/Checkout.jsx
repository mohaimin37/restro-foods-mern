import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";
import { selectCartItems, selectCartSubtotal, clearCart } from "../features/cart/cartSlice";
import { createCheckoutSession } from "../api/paymentApi";
import { createOrder } from "../api/orderApi";

const Checkout = () => {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    phone: user?.phone || "",
  });

  const deliveryFee = subtotal >= 40 ? 0 : 3.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  const handleChange = (e) => setAddress({ ...address, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    const payload = {
      items: items.map((i) => ({ menuItem: i.menuItem, name: i.name, quantity: i.quantity })),
      shippingAddress: address,
    };

    try {
      if (paymentMethod === "Stripe") {
        const { url } = await createCheckoutSession(payload);
        window.location.href = url;
      } else {
        const { order } = await createOrder({ ...payload, paymentMethod: "CashOnDelivery" });
        dispatch(clearCart());
        toast.success("Order placed successfully!");
        navigate(`/order-success/${order._id}`);
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="card p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">
              Delivery Address
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Street Address</label>
                <input
                  name="street"
                  required
                  value={address.street}
                  onChange={handleChange}
                  className="input"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label className="label">City</label>
                <input name="city" required value={address.city} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">State</label>
                <input name="state" required value={address.state} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">ZIP Code</label>
                <input name="zip" required value={address.zip} onChange={handleChange} className="input" />
              </div>
              <div>
                <label className="label">Phone</label>
                <input name="phone" required value={address.phone} onChange={handleChange} className="input" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">
              Payment Method
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("Stripe")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                  paymentMethod === "Stripe"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-ink-200 dark:border-ink-700"
                }`}
              >
                <FaCreditCard className="text-brand-600" size={20} />
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">Pay with Card</p>
                  <p className="text-xs text-ink-500">Secure checkout via Stripe</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("CashOnDelivery")}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                  paymentMethod === "CashOnDelivery"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-ink-200 dark:border-ink-700"
                }`}
              >
                <FaMoneyBillWave className="text-green-600" size={20} />
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">Cash on Delivery</p>
                  <p className="text-xs text-ink-500">Pay when your order arrives</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="card h-fit p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">Order Summary</h2>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1 text-sm">
            {items.map((item) => (
              <div key={item.menuItem} className="flex justify-between text-ink-600 dark:text-ink-300">
                <span>{item.quantity} x {item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="my-4 border-t border-dashed border-ink-200 dark:border-ink-700" />
          <div className="space-y-2 text-sm text-ink-600 dark:text-ink-300">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="my-4 border-t border-dashed border-ink-200 dark:border-ink-700" />
          <div className="mb-6 flex justify-between font-display text-lg font-bold text-ink-900 dark:text-white">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            <FaLock size={12} /> {loading ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
