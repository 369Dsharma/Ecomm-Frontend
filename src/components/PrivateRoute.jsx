import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "./Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading message="Checking authentication..." />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
