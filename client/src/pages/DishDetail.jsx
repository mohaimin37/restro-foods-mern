import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaLeaf, FaDrumstickBite, FaFire, FaClock, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import Loader from "../components/Loader";
import StarRating from "../components/StarRating";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import { getMenuItemById } from "../api/menuApi";
import { getReviewsForItem, createReview, deleteReview } from "../api/reviewApi";
import { addToCart } from "../features/cart/cartSlice";

const DishDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => getReviewsForItem(id).then((data) => setReviews(data.reviews));

  useEffect(() => {
    setLoading(true);
    Promise.all([getMenuItemById(id), getReviewsForItem(id)])
      .then(([dishData, reviewData]) => {
        setDish(dishData.item);
        setReviews(reviewData.reviews);
      })
      .catch(() => toast.error("Dish not found"))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...dish, qty }));
    toast.success(`${qty} x ${dish.name} added to cart`);
  };

  const handleReviewSubmit = async (payload) => {
    if (!user) {
      toast.error("Please login to leave a review");
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      await createReview(id, payload);
      toast.success("Review submitted!");
      loadReviews();
      getMenuItemById(id).then((data) => setDish(data.item));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review removed");
      loadReviews();
      getMenuItemById(id).then((data) => setDish(data.item));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;
  if (!dish) return null;

  return (
    <div className="container-app py-10">
      <nav className="mb-6 text-sm text-ink-500 dark:text-ink-400">
        <Link to="/menu" className="hover:text-brand-600">Menu</Link> / {dish.category} / <span className="text-ink-800 dark:text-ink-200">{dish.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl">
          <img src={dish.image} alt={dish.name} className="h-full max-h-[480px] w-full object-cover" />
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className={`badge ${dish.isVeg ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {dish.isVeg ? <FaLeaf size={11} /> : <FaDrumstickBite size={11} />} {dish.isVeg ? "Veg" : "Non-Veg"}
            </span>
            {dish.spiceLevel !== "None" && (
              <span className="badge bg-orange-100 text-orange-700"><FaFire size={11} /> {dish.spiceLevel}</span>
            )}
            <span className="badge bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300">
              <FaClock size={11} /> {dish.prepTimeMinutes} min
            </span>
          </div>

          <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white sm:text-4xl">
            {dish.name}
          </h1>

          <div className="mt-3">
            <StarRating rating={dish.rating} count={dish.numReviews} showValue size={16} />
          </div>

          <p className="mt-4 text-ink-600 dark:text-ink-300">{dish.description}</p>

          <div className="mt-2 text-sm text-ink-400">{dish.calories} kcal</div>

          <div className="mt-6 font-display text-3xl font-bold text-brand-600">
            ${dish.price.toFixed(2)}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-ink-200 px-3 py-2 dark:border-ink-700">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                <FaMinus size={12} />
              </button>
              <span className="w-6 text-center font-semibold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                <FaPlus size={12} />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!dish.isAvailable}
              className="btn-primary flex-1"
            >
              <FaShoppingCart size={14} /> {dish.isAvailable ? "Add to Cart" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">
          Reviews ({reviews.length})
        </h2>
        <div className="mb-8">
          {user ? (
            <ReviewForm onSubmit={handleReviewSubmit} submitting={submitting} />
          ) : (
            <div className="card p-5 text-sm text-ink-500 dark:text-ink-400">
              <Link to="/login" className="font-semibold text-brand-600">Login</Link> to leave a review.
            </div>
          )}
        </div>
        <ReviewList reviews={reviews} onDelete={handleReviewDelete} />
      </div>
    </div>
  );
};

export default DishDetail;
