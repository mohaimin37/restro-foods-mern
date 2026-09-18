import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeartBroken } from "react-icons/fa";
import DishCard from "../components/DishCard";

const Favorites = () => {
  const { items, loaded } = useSelector((state) => state.favorites);

  if (!loaded) return null;

  return (
    <div className="container-app py-10">
      <h1 className="mb-8 font-display text-3xl font-bold text-ink-900 dark:text-white">My Favorites</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FaHeartBroken size={48} className="mb-4 text-ink-300" />
          <p className="text-ink-500 dark:text-ink-400">You haven't saved any favorites yet.</p>
          <Link to="/menu" className="btn-primary mt-6">Browse Menu</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((dish) => (
            <DishCard key={dish._id} dish={dish} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
