import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/AuthContext";

const PublicRoutes = ({ children }) => {
  const { isAuthd } = useUserContext();

  return isAuthd ? <Navigate to="/profile" replace /> : children;
};

export default PublicRoutes;