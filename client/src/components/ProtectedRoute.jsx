import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Loader from "./Loader";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, initialCheckDone } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialCheckDone) return <Loader full label="Checking your session..." />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
