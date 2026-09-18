import { Link } from "react-router-dom";

const categories = [
  { name: "Starters", image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400" },
  { name: "Main Course", image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400" },
  { name: "Biryani & Rice", image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400" },
  { name: "Breads", image: "https://images.unsplash.com/photo-1626777553635-be9b6d7cb32e?w=400" },
  { name: "South Indian", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400" },
  { name: "Chaat & Street Food", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1666190092760-9e5377cadb85?w=400" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400" },
];

const CategoryGrid = () => (
  <section className="container-app py-16">
    <div className="mb-10 text-center">
      <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
        Browse by Category
      </h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">Find exactly what you're craving</p>
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
      {categories.map((cat) => (
        <Link
          key={cat.name}
          to={`/menu?category=${encodeURIComponent(cat.name)}`}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-ink-800 dark:bg-ink-900"
        >
          <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-brand-100 dark:ring-brand-900/40">
            <img src={cat.image} alt={cat.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
          </div>
          <span className="text-sm font-semibold text-ink-800 dark:text-ink-100">{cat.name}</span>
        </Link>
      ))}
    </div>
  </section>
);

export default CategoryGrid;
