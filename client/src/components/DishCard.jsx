import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaLeaf, FaDrumstickBite, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import StarRating from "./StarRating";
import { addToCart } from "../features/cart/cartSlice";
import { toggleFavorite, selectIsFavorite } from "../features/favorites/favoritesSlice";
import { formatPrice } from "../utils/format";

const DishCard = ({ dish }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isFavorite = useSelector(selectIsFavorite(dish._id));

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart(dish));
    toast.success(`${dish.name} added to cart`);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save favorites");
      navigate("/login");
      return;
    }
    dispatch(toggleFavorite(dish));
    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
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
          <button
            onClick={handleFavorite}
            aria-label="Toggle favorite"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition-transform hover:scale-110 dark:bg-ink-900/80"
          >
            {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
          </button>
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
              {formatPrice(dish.price)}
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
