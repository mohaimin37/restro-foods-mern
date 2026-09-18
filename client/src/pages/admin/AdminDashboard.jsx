import { useEffect, useState } from "react";
import {
  FaDollarSign,
  FaShoppingBag,
  FaUsers,
  FaCalendarCheck,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import Loader from "../../components/Loader";
import StatCard from "../../components/StatCard";
import { getDashboardStats } from "../../api/adminApi";

const COLORS = ["#f97316", "#3b82f6", "#a855f7", "#6366f1", "#22c55e", "#ef4444"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader full />;
  if (!data) return null;

  const { stats, salesByDay, ordersByStatus, topDishes } = data;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FaDollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} accent="green" />
        <StatCard icon={FaShoppingBag} label="Total Orders" value={stats.totalOrders} accent="brand" />
        <StatCard icon={FaUsers} label="Customers" value={stats.totalUsers} accent="blue" />
        <StatCard icon={FaCalendarCheck} label="Pending Reservations" value={stats.pendingReservations} accent="purple" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-display font-bold text-ink-900 dark:text-white">Revenue (Last 30 Days)</h2>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={salesByDay}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => `$${v.toFixed(2)}`} />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" fill="url(#rev)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="mb-4 font-display font-bold text-ink-900 dark:text-white">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={ordersByStatus} dataKey="count" nameKey="_id" outerRadius={90} label>
                {ordersByStatus.map((entry, i) => (
                  <Cell key={entry._id} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card mt-6 p-5">
        <h2 className="mb-4 font-display font-bold text-ink-900 dark:text-white">Top Selling Dishes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500 dark:border-ink-800 dark:text-ink-400">
                <th className="py-2">Dish</th>
                <th className="py-2">Units Sold</th>
                <th className="py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topDishes.map((d) => (
                <tr key={d._id} className="border-b border-ink-50 dark:border-ink-800/50">
                  <td className="py-2.5 font-medium text-ink-800 dark:text-ink-100">{d.name}</td>
                  <td className="py-2.5">{d.totalSold}</td>
                  <td className="py-2.5">${d.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
