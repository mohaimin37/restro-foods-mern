import { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { getAllUsers, toggleUserActive } from "../../api/adminApi";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => getAllUsers().then((data) => setUsers(data.users)).finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (id) => {
    try {
      await toggleUserActive(id);
      toast.success("User status updated");
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loader full />;

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-white">Users</h1>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-ink-500 dark:border-ink-800 dark:text-ink-400">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-ink-50 dark:border-ink-800/50">
                <td className="p-4 font-medium text-ink-800 dark:text-ink-100">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4 capitalize">{u.role}</td>
                <td className="p-4 text-xs text-ink-400">{format(new Date(u.createdAt), "MMM d, yyyy")}</td>
                <td className="p-4">
                  <span className={`badge ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-4">
                  {u.role !== "admin" && (
                    <button onClick={() => handleToggle(u._id)} className="btn-outline !py-1.5 text-xs">
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
