import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating = 0, size = 14, showValue = false, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} size={size} className="text-amber-400" />);
    else if (rating >= i - 0.5)
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-amber-400" />);
    else stars.push(<FaRegStar key={i} size={size} className="text-amber-400" />);
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showValue && (
        <span className="text-xs font-medium text-ink-500 dark:text-ink-400">
          {rating.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
};

export default StarRating;
