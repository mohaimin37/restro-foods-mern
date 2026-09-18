import { useState } from "react";
import toast from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thanks for subscribing! Watch your inbox for exclusive deals.");
    setEmail("");
  };

  return (
    <section className="container-app py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-14 text-center shadow-xl">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10" />
        <h2 className="font-display text-3xl font-bold text-white">Get 15% Off Your First Order</h2>
        <p className="mx-auto mt-2 max-w-md text-brand-50">
          Subscribe to our newsletter for exclusive deals, new menu drops, and more.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input flex-1 !bg-white/95"
          />
          <button type="submit" className="btn bg-ink-900 text-white hover:bg-ink-800">
            <FaPaperPlane size={13} /> Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
