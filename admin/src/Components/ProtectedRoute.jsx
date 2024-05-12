/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element: Element }) => {
  const token = localStorage.getItem("admin-token");
  return token ? Element : <Navigate to="/" />;
};

export default ProtectedRoute;
