const Loader = ({ full = false, label = "Loading..." }) => (
  <div
    className={
      full
        ? "flex min-h-[60vh] w-full flex-col items-center justify-center gap-3"
        : "flex w-full flex-col items-center justify-center gap-3 py-10"
    }
  >
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    <p className="text-sm text-ink-500 dark:text-ink-400">{label}</p>
  </div>
);

export default Loader;
