import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../../api/couponApi";

const emptyForm = {
  code: "",
  discountType: "flat",
  discountValue: "",
  minOrderValue: "",
  maxDiscount: "",
  expiryDate: "",
  usageLimit: "",
  isActive: true,
};

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => getAllCoupons().then((data) => setCoupons(data.coupons)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createCoupon({
        ...form,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
      });
      toast.success("Coupon created");
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await updateCoupon(coupon._id, { isActive: !coupon.isActive });
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Coupons</h1>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
          <FaPlus size={13} /> New Coupon
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-ink-900 dark:text-white">New Coupon</h2>
            <button onClick={() => setShowForm(false)} className="text-ink-400 hover:text-red-600">
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Code</label>
              <input name="code" required value={form.code} onChange={handleChange} className="input" placeholder="e.g. SAVE100" />
            </div>
            <div>
              <label className="label">Discount Type</label>
              <select name="discountType" value={form.discountType} onChange={handleChange} className="input">
                <option value="flat">Flat (Rs.)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>
            <div>
              <label className="label">Discount Value</label>
              <input type="number" name="discountValue" required value={form.discountValue} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Min Order Value (Rs.)</label>
              <input type="number" name="minOrderValue" value={form.minOrderValue} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Max Discount (Rs., optional)</label>
              <input type="number" name="maxDiscount" value={form.maxDiscount} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Usage Limit (optional)</label>
              <input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Expiry Date</label>
              <input type="date" name="expiryDate" required value={form.expiryDate} onChange={handleChange} className="input" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 accent-brand-600" /> Active
              </label>
            </div>
            <div className="sm:col-span-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Create Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Min Order</th>
              <th className="p-4">Used</th>
              <th className="p-4">Expires</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c._id} className="border-b border-ink-50 dark:border-ink-800/50">
                <td className="p-4 font-mono font-semibold text-ink-800 dark:text-ink-100">{c.code}</td>
                <td className="p-4">{c.discountType === "flat" ? `Rs.${c.discountValue}` : `${c.discountValue}%`}</td>
                <td className="p-4">Rs.{c.minOrderValue}</td>
                <td className="p-4">{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="p-4">{format(new Date(c.expiryDate), "MMM d, yyyy")}</td>
                <td className="p-4">
                  <button onClick={() => handleToggleActive(c)}>
                    <span className={`badge ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </button>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {coupons.length === 0 && (
          <p className="py-10 text-center text-sm text-ink-500 dark:text-ink-400">No coupons yet.</p>
        )}
      </div>
    </div>
  );
};

export default ManageCoupons;
