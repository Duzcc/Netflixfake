
import React from "react";
import { Navigate } from "react-router-dom";

function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? <Navigate to="/" replace /> : children;
}

export default PublicRoute;
