import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock, FaUtensils, FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../features/auth/authSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      navigate(from, { replace: true });
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-brand-600">
            <FaUtensils /> Restro<span className="text-ink-900 dark:text-white">Foods</span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-white">Welcome Back</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Login to continue your order</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input pl-10"
                placeholder="you@example.com"
              />
            </div>
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input pl-10 pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400"
              >
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
            {status === "loading" ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 rounded-xl bg-ink-50 p-3 text-center text-xs text-ink-500 dark:bg-ink-800 dark:text-ink-400">
          Demo: admin@restrofoods.com / admin123 (admin) &nbsp;|&nbsp; customer@restrofoods.com / customer123
        </p>

        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-600">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
