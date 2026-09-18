import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaLeaf, FaShippingFast, FaHeadset } from "react-icons/fa";
import Hero from "../components/Hero";
import CategoryGrid from "../components/CategoryGrid";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import DishCard from "../components/DishCard";
import Loader from "../components/Loader";
import { getFeaturedItems } from "../api/menuApi";

const perks = [
  { icon: FaLeaf, title: "Fresh Ingredients", text: "Sourced daily from trusted local farms." },
  { icon: FaShippingFast, title: "Fast Delivery", text: "Hot food at your door in 20-30 minutes." },
  { icon: FaHeadset, title: "24/7 Support", text: "We're here for you, whenever you need us." },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedItems()
      .then((data) => setFeatured(data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />

      <section className="container-app grid grid-cols-1 gap-6 py-12 sm:grid-cols-3">
        {perks.map(({ icon: Icon, title, text }) => (
          <div key={title} className="card flex items-start gap-4 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40">
              <Icon size={18} />
            </span>
            <div>
              <h3 className="font-semibold text-ink-900 dark:text-white">{title}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400">{text}</p>
            </div>
          </div>
        ))}
      </section>

      <CategoryGrid />

      <section className="container-app py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
              Featured Dishes
            </h2>
            <p className="mt-2 text-ink-500 dark:text-ink-400">Our chef's most-loved creations</p>
          </div>
          <Link to="/menu" className="btn-outline hidden sm:inline-flex">
            View Full Menu <FaArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading featured dishes..." />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((dish) => (
              <DishCard key={dish._id} dish={dish} />
            ))}
          </div>
        )}
      </section>

      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Home;
