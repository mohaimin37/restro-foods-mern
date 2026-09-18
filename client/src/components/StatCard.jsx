const StatCard = ({ icon: Icon, label, value, accent = "brand" }) => {
  const accentClasses = {
    brand: "bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300",
    green: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300",
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300",
    purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300",
  };

  return (
    <div className="card flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
