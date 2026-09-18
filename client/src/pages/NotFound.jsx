import { Link } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";

const NotFound = () => (
  <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
    <FaUtensils size={48} className="mb-4 text-brand-300" />
    <h1 className="font-display text-5xl font-bold text-ink-900 dark:text-white">404</h1>
    <p className="mt-3 text-ink-500 dark:text-ink-400">
      Looks like this page got eaten. Let's get you back to the menu.
    </p>
    <Link to="/" className="btn-primary mt-6">Back to Home</Link>
  </div>
);

export default NotFound;
