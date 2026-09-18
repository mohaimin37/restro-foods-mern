import { NavLink, Outlet, Link } from "react-router-dom";
import {
  FaChartLine,
  FaUtensils,
  FaClipboardList,
  FaCalendarCheck,
  FaStar,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa";

const links = [
  { to: "/admin", label: "Dashboard", icon: FaChartLine, end: true },
  { to: "/admin/menu", label: "Manage Menu", icon: FaUtensils },
  { to: "/admin/orders", label: "Orders", icon: FaClipboardList },
  { to: "/admin/reservations", label: "Reservations", icon: FaCalendarCheck },
  { to: "/admin/reviews", label: "Reviews", icon: FaStar },
  { to: "/admin/users", label: "Users", icon: FaUsers },
];

const AdminLayout = () => (
  <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
    <aside className="hidden w-64 shrink-0 border-r border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900 md:block">
      <Link to="/" className="mb-8 flex items-center gap-2 font-display text-lg font-bold text-brand-600">
        <FaUtensils /> Restro<span className="text-ink-900 dark:text-white">Admin</span>
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                  : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              }`
            }
          >
            <Icon size={15} /> {label}
          </NavLink>
        ))}
      </nav>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-brand-600 dark:text-ink-400"
      >
        <FaArrowLeft size={13} /> Back to site
      </Link>
    </aside>
    <div className="flex-1 overflow-x-hidden">
      <div className="container-app py-8">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AdminLayout;
