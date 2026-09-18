import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "../../api/menuApi";

const categories = ["Starters", "Main Course", "Pizza", "Burgers", "Desserts", "Beverages", "Salads"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Main Course",
  image: "",
  isVeg: true,
  isFeatured: false,
  spiceLevel: "None",
  calories: "",
  prepTimeMinutes: "",
  isAvailable: true,
};

const ManageMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () =>
    getMenuItems({ limit: 100 }).then((data) => setItems(data.items)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setForm({ ...item, price: item.price, calories: item.calories, prepTimeMinutes: item.prepTimeMinutes });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      calories: Number(form.calories) || 0,
      prepTimeMinutes: Number(form.prepTimeMinutes) || 15,
    };
    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
        toast.success("Dish updated");
      } else {
        await createMenuItem(payload);
        toast.success("Dish created");
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dish permanently?")) return;
    try {
      await deleteMenuItem(id);
      toast.success("Dish deleted");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-white">Manage Menu</h1>
        <button onClick={openCreate} className="btn-primary">
          <FaPlus size={13} /> Add Dish
        </button>
      </div>

      {showForm && (
        <div className="card mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display font-bold text-ink-900 dark:text-white">
              {editingId ? "Edit Dish" : "New Dish"}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-ink-400 hover:text-red-600">
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input name="name" required value={form.name} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <textarea name="description" required rows={2} value={form.description} onChange={handleChange} className="input resize-none" />
            </div>
            <div>
              <label className="label">Price ($)</label>
              <input type="number" step="0.01" name="price" required value={form.price} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input name="image" required value={form.image} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Calories</label>
              <input type="number" name="calories" value={form.calories} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Prep Time (min)</label>
              <input type="number" name="prepTimeMinutes" value={form.prepTimeMinutes} onChange={handleChange} className="input" />
            </div>
            <div>
              <label className="label">Spice Level</label>
              <select name="spiceLevel" value={form.spiceLevel} onChange={handleChange} className="input">
                {["None", "Mild", "Medium", "Hot"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isVeg" checked={form.isVeg} onChange={handleChange} className="h-4 w-4 accent-brand-600" /> Veg
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="h-4 w-4 accent-brand-600" /> Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} className="h-4 w-4 accent-brand-600" /> Available
              </label>
            </div>
            <div className="sm:col-span-2">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? "Saving..." : editingId ? "Update Dish" : "Create Dish"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <th className="p-4">Dish</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-b border-ink-50 dark:border-ink-800/50">
                <td className="flex items-center gap-3 p-4">
                  <img src={item.image} alt={item.name} className="h-10 w-10 rounded-lg object-cover" />
                  <span className="font-medium text-ink-800 dark:text-ink-100">{item.name}</span>
                </td>
                <td className="p-4">{item.category}</td>
                <td className="p-4">${item.price.toFixed(2)}</td>
                <td className="p-4">{item.rating.toFixed(1)} ({item.numReviews})</td>
                <td className="p-4">
                  <span className={`badge ${item.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {item.isAvailable ? "Available" : "Sold Out"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800" aria-label="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800" aria-label="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageMenu;
