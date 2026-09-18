import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus, FaTrash, FaArrowRight, FaShoppingBag } from "react-icons/fa";
import {
  selectCartItems,
  selectCartSubtotal,
  incrementItem,
  decrementItem,
  removeFromCart,
} from "../features/cart/cartSlice";

const Cart = () => {
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const deliveryFee = subtotal >= 40 || subtotal === 0 ? 0 : 3.99;
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: { pathname: "/checkout" } } });
      return;
    }
    navigate("/checkout");
  };

  if (items.length === 0) {
    return (
      <div className="container-app flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FaShoppingBag size={48} className="mb-4 text-ink-300" />
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Your cart is empty</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">Looks like you haven't added anything yet.</p>
        <Link to="/menu" className="btn-primary mt-6">
          Browse Menu <FaArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-app py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">Your Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.menuItem} className="card flex items-center gap-4 p-4">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-ink-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-ink-500">${item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-3 rounded-full border border-ink-200 px-3 py-1.5 dark:border-ink-700">
                <button onClick={() => dispatch(decrementItem(item.menuItem))} aria-label="Decrease">
                  <FaMinus size={11} />
                </button>
                <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                <button onClick={() => dispatch(incrementItem(item.menuItem))} aria-label="Increase">
                  <FaPlus size={11} />
                </button>
              </div>
              <div className="w-16 text-right font-semibold text-ink-900 dark:text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => dispatch(removeFromCart(item.menuItem))}
                aria-label="Remove"
                className="text-ink-400 hover:text-red-600"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="card h-fit p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-ink-900 dark:text-white">Order Summary</h2>
          <div className="space-y-2 text-sm text-ink-600 dark:text-ink-300">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
          </div>
          <div className="my-4 border-t border-dashed border-ink-200 dark:border-ink-700" />
          <div className="mb-6 flex justify-between font-display text-lg font-bold text-ink-900 dark:text-white">
            <span>Total</span><span>${total.toFixed(2)}</span>
          </div>
          {subtotal < 40 && (
            <p className="mb-4 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
              Add ${(40 - subtotal).toFixed(2)} more for free delivery!
            </p>
          )}
          <button onClick={handleCheckout} className="btn-primary w-full">
            Proceed to Checkout <FaArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
