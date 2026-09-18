import { useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ onSubmit, submitting }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    onSubmit({ rating, comment: comment.trim() });
    setRating(0);
    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-3 p-5">
      <p className="label">Your rating</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            aria-label={`Rate ${star} stars`}
          >
            <FaStar
              size={22}
              className={
                (hoverRating || rating) >= star ? "text-amber-400" : "text-ink-200 dark:text-ink-700"
              }
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this dish..."
        rows={3}
        className="input resize-none"
        required
      />
      <button type="submit" disabled={submitting} className="btn-primary">
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
