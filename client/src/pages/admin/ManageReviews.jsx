import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import StarRating from "../../components/StarRating";
import { getAllReviews, deleteReview } from "../../api/reviewApi";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getAllReviews().then((data) => setReviews(data.reviews)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Reviews</h1>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <th className="p-4">Dish</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Comment</th>
              <th className="p-4">Date</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b border-ink-50 dark:border-ink-800/50">
                <td className="p-4 font-medium text-ink-800 dark:text-ink-100">{review.menuItem?.name}</td>
                <td className="p-4">{review.user?.name}</td>
                <td className="p-4"><StarRating rating={review.rating} /></td>
                <td className="max-w-xs truncate p-4 text-ink-500">{review.comment}</td>
                <td className="p-4 text-xs text-ink-400">{format(new Date(review.createdAt), "MMM d, yyyy")}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(review._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageReviews;
