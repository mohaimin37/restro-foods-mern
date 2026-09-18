import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch, FaLeaf } from "react-icons/fa";
import DishCard from "../components/DishCard";
import Loader from "../components/Loader";
import { getMenuItems } from "../api/menuApi";

const categories = [
  "All",
  "Starters",
  "Main Course",
  "Biryani & Rice",
  "Breads",
  "South Indian",
  "Chaat & Street Food",
  "Desserts",
  "Beverages",
];

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState(1);

  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const vegOnly = searchParams.get("isVeg") === "true";
  const page = Number(searchParams.get("page")) || 1;

  const updateParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value === "" || value === "All" || value === false) next.delete(key);
      else next.set(key, value);
      if (key !== "page") next.delete("page");
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    setLoading(true);
    const params = { sort, page, limit: 12 };
    if (category !== "All") params.category = category;
    if (search) params.search = search;
    if (vegOnly) params.isVeg = true;

    getMenuItems(params)
      .then((data) => {
        setItems(data.items);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, vegOnly, page]);

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-white">Our Menu</h1>
        <p className="mt-2 text-ink-500 dark:text-ink-400">
          {items.length > 0 ? "Handcrafted dishes made fresh, just for you." : "Find your next favorite dish"}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" size={14} />
          <input
            defaultValue={search}
            onChange={(e) => updateParam("search", e.target.value)}
            placeholder="Search dishes..."
            className="input pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-ink-600 dark:text-ink-300">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) => updateParam("isVeg", e.target.checked)}
              className="h-4 w-4 rounded accent-brand-600"
            />
            <FaLeaf className="text-green-600" /> Veg Only
          </label>
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="input !w-auto"
          >
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => updateParam("category", cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-brand-600 text-white shadow-md shadow-brand-600/30"
                : "bg-white text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300 dark:hover:bg-ink-800"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader label="Fetching delicious options..." />
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-ink-500 dark:text-ink-400">
          No dishes found. Try adjusting your filters.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((dish) => (
              <DishCard key={dish._id} dish={dish} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParam("page", p)}
                  className={`h-10 w-10 rounded-full text-sm font-medium ${
                    page === p
                      ? "bg-brand-600 text-white"
                      : "bg-white text-ink-600 hover:bg-ink-100 dark:bg-ink-900 dark:text-ink-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;
