import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import AuthorDashboard from "../pages/author/AuthorDashboard";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/author" element={<AuthorDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
