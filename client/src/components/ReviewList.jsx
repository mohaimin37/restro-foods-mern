import { useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import StarRating from "./StarRating";

const ReviewList = ({ reviews, onDelete }) => {
  const { user } = useSelector((state) => state.auth);

  if (reviews.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-ink-500 dark:text-ink-400">
        No reviews yet. Be the first to share your experience!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="card p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {review.user?.name?.[0]?.toUpperCase() || "?"}
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-white">
                  {review.user?.name || "Anonymous"}
                </p>
                <p className="text-xs text-ink-400">
                  {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
            {(user?._id === review.user?._id || user?.role === "admin") && (
              <button
                onClick={() => onDelete(review._id)}
                aria-label="Delete review"
                className="text-ink-400 hover:text-red-600"
              >
                <FaTrash size={13} />
              </button>
            )}
          </div>
          <div className="mt-3">
            <StarRating rating={review.rating} />
          </div>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{review.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
