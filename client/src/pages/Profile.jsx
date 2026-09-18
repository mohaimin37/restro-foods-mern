import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaUserCircle, FaSave } from "react-icons/fa";
import { updateProfile } from "../features/auth/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      phone: form.phone,
      address: { street: form.street, city: form.city, state: form.state, zip: form.zip },
    };
    if (form.password) payload.password = form.password;

    const result = await dispatch(updateProfile(payload));
    setSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated successfully");
      setForm({ ...form, password: "" });
    } else {
      toast.error(result.payload || "Update failed");
    }
  };

  return (
    <div className="container-app max-w-2xl py-10">
      <div className="mb-8 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
          {user?.name?.[0]?.toUpperCase()}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">{user?.name}</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900 dark:text-white">
          <FaUserCircle /> Account Details
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input" required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input" />
          </div>
        </div>

        <div>
          <label className="label">Street Address</label>
          <input name="street" value={form.street} onChange={handleChange} className="input" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label">City</label>
            <input name="city" value={form.city} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">State</label>
            <input name="state" value={form.state} onChange={handleChange} className="input" />
          </div>
          <div>
            <label className="label">ZIP</label>
            <input name="zip" value={form.zip} onChange={handleChange} className="input" />
          </div>
        </div>

        <div>
          <label className="label">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="input"
            placeholder="Leave blank to keep current password"
            minLength={6}
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <FaSave size={13} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
