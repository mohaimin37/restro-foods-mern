import { Link } from "react-router-dom";
import { FaUtensils, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const Footer = () => (
  <footer className="mt-20 border-t border-ink-100 bg-white dark:border-ink-800 dark:bg-ink-950">
    <div className="container-app grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold text-brand-600">
          <FaUtensils /> Restro<span className="text-ink-900 dark:text-white">Foods</span>
        </Link>
        <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
          Fresh ingredients, bold flavors, delivered fast. Your neighborhood kitchen, online.
        </p>
        <div className="mt-4 flex gap-3 text-ink-500 dark:text-ink-400">
          <a href="#" aria-label="Facebook" className="hover:text-brand-600"><FaFacebook size={18} /></a>
          <a href="#" aria-label="Instagram" className="hover:text-brand-600"><FaInstagram size={18} /></a>
          <a href="#" aria-label="Twitter" className="hover:text-brand-600"><FaTwitter size={18} /></a>
        </div>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold text-ink-900 dark:text-white">Explore</h4>
        <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
          <li><Link to="/menu" className="hover:text-brand-600">Our Menu</Link></li>
          <li><Link to="/reservation" className="hover:text-brand-600">Reserve a Table</Link></li>
          <li><Link to="/orders" className="hover:text-brand-600">Track Order</Link></li>
          <li><Link to="/register" className="hover:text-brand-600">Create Account</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold text-ink-900 dark:text-white">Categories</h4>
        <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-400">
          <li><Link to="/menu?category=Pizza" className="hover:text-brand-600">Pizza</Link></li>
          <li><Link to="/menu?category=Burgers" className="hover:text-brand-600">Burgers</Link></li>
          <li><Link to="/menu?category=Main Course" className="hover:text-brand-600">Main Course</Link></li>
          <li><Link to="/menu?category=Desserts" className="hover:text-brand-600">Desserts</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="mb-3 font-display font-semibold text-ink-900 dark:text-white">Contact Us</h4>
        <ul className="space-y-3 text-sm text-ink-500 dark:text-ink-400">
          <li className="flex items-start gap-2"><FaMapMarkerAlt className="mt-0.5 shrink-0 text-brand-500" /> 221B Flavor Street, Foodville</li>
          <li className="flex items-center gap-2"><FaPhoneAlt className="text-brand-500" /> +1 (555) 123-4567</li>
          <li className="flex items-center gap-2"><FaEnvelope className="text-brand-500" /> hello@restrofoods.com</li>
        </ul>
      </div>
    </div>
    <div className="border-t border-ink-100 py-5 text-center text-xs text-ink-400 dark:border-ink-800">
      © {new Date().getFullYear()} Restro Foods. All rights reserved.
    </div>
  </footer>
);

export default Footer;
