const statusStyles = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Preparing: "bg-purple-100 text-purple-700",
  "Out for Delivery": "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderStatusBadge = ({ status }) => (
  <span className={`badge ${statusStyles[status] || "bg-ink-100 text-ink-600"}`}>{status}</span>
);

export default OrderStatusBadge;
