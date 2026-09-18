import { FaQuoteLeft } from "react-icons/fa";
import StarRating from "./StarRating";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Regular Customer",
    text: "The butter chicken tastes just like ghar ka khana. Delivery was quick and the packaging kept everything piping hot!",
    rating: 5,
  },
  {
    name: "Rohan Mehta",
    role: "Food Blogger",
    text: "Best biryani in the city, hands down. Perfectly cooked rice, generous portions, and the dum flavor is spot on.",
    rating: 5,
  },
  {
    name: "Ananya Iyer",
    role: "Verified Buyer",
    text: "Booked a table for my anniversary and the whole experience was seamless, from reservation to the last bite of gulab jamun.",
    rating: 4.5,
  },
];

const Testimonials = () => (
  <section className="bg-ink-50 py-16 dark:bg-ink-900/40">
    <div className="container-app">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-ink-500 dark:text-ink-400">Real reviews from real food lovers</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <div key={t.name} className="card p-6">
            <FaQuoteLeft className="mb-3 text-brand-300" size={22} />
            <p className="mb-4 text-sm text-ink-600 dark:text-ink-300">{t.text}</p>
            <StarRating rating={t.rating} />
            <div className="mt-4">
              <p className="font-semibold text-ink-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-ink-400">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
