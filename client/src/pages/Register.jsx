import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaUtensils } from "react-icons/fa";
import { registerUser } from "../features/auth/authSlice";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const result = await dispatch(registerUser(form));
    if (registerUser.fulfilled.match(result)) {
      toast.success(`Welcome, ${result.payload.name}!`);
      navigate("/");
    } else {
      toast.error(result.payload || "Registration failed");
    }
  };

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl font-bold text-brand-600">
            <FaUtensils /> Restro<span className="text-ink-900 dark:text-white">Foods</span>
          </Link>
          <h1 className="mt-4 font-display text-2xl font-bold text-ink-900 dark:text-white">Create an Account</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Join us for exclusive deals and faster checkout</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input pl-10"
                placeholder="John Doe"
              />
            </div>
          </div>
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
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input pl-10"
                placeholder="At least 6 characters"
              />
            </div>
          </div>
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
            {status === "loading" ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500 dark:text-ink-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
