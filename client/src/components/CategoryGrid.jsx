import { Link } from "react-router-dom";

const categories = [
  { name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400" },
  { name: "Burgers", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400" },
  { name: "Main Course", image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400" },
  { name: "Salads", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
  { name: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400" },
];

const CategoryGrid = () => (
  <section className="container-app py-16">
    <div className="mb-10 text-center">
      <h2 className="font-display text-3xl font-bold text-ink-900 dark:text-white">
        Browse by Category
      </h2>
      <p className="mt-2 text-ink-500 dark:text-ink-400">Find exactly what you're craving</p>
    </div>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
