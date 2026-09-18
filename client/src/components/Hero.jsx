import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaTruck, FaClock } from "react-icons/fa";

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-brand-50 dark:from-ink-900 dark:via-ink-950 dark:to-ink-900">
    <div className="container-app grid grid-cols-1 items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="badge mb-4 bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          🔥 Authentic Indian Cuisine, Delivered Hot
        </span>
        <h1 className="font-display text-4xl font-bold leading-tight text-ink-900 dark:text-white sm:text-5xl lg:text-6xl">
          Desi Flavors, <br />
          Delivered to <span className="text-brand-600">Your Door.</span>
        </h1>
        <p className="mt-5 max-w-md text-base text-ink-500 dark:text-ink-400">
          From sizzling tandoori kebabs to slow-cooked biryani, every dish is made fresh with
          authentic spices. Order online or reserve a table for a true Indian dining experience.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/menu" className="btn-primary">
            Order Now <FaArrowRight size={13} />
          </Link>
          <Link to="/reservation" className="btn-outline">
            Reserve a Table
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
            <FaStar className="text-amber-400" /> 4.9/5 Rating
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
            <FaTruck className="text-brand-500" /> Free delivery over ₹499
          </div>
          <div className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-300">
            <FaClock className="text-brand-500" /> 20-30 min avg.
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        <div className="absolute -inset-6 -z-10 rounded-full bg-brand-400/20 blur-3xl" />
        <img
          src="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=900"
          alt="Authentic Indian food spread"
          className="aspect-square w-full rounded-[2.5rem] object-cover shadow-2xl"
        />
      </motion.div>
    </div>
  </section>
);

export default Hero;
