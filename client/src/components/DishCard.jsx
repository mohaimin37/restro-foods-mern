import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaLeaf, FaDrumstickBite, FaShoppingCart } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import { addToCart } from "../features/cart/cartSlice";

const DishCard = ({ dish }) => {
  const dispatch = useDispatch();

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart(dish));
    toast.success(`${dish.name} added to cart`);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card group overflow-hidden"
    >
      <Link to={`/menu/${dish._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <span
            className={`badge absolute left-3 top-3 ${
              dish.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {dish.isVeg ? <FaLeaf size={11} /> : <FaDrumstickBite size={11} />}
          </span>
          {!dish.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-900">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-ink-900 dark:text-white">{dish.name}</h3>
            <span className="whitespace-nowrap font-display font-bold text-brand-600">
              ${dish.price.toFixed(2)}
            </span>
          </div>
          <p className="mb-2 line-clamp-2 text-sm text-ink-500 dark:text-ink-400">
            {dish.description}
          </p>
          <StarRating rating={dish.rating} count={dish.numReviews} showValue />
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAdd}
          disabled={!dish.isAvailable}
          className="btn-primary w-full !py-2 text-sm"
        >
          <FaShoppingCart size={13} /> Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default DishCard;
