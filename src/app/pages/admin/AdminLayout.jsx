import { Link, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  BarChart3,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from 'react';
export function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/login');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { path: "/admin", label: "Tổng quan", icon: LayoutDashboard },
    { path: "/admin/products", label: "Sản phẩm", icon: Package },
    { path: "/admin/orders", label: "Đơn hàng", icon: ShoppingBag },
    { path: "/admin/categories", label: "Danh mục", icon: FolderTree },
    { path: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
  ];


  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-8 py-4 flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold text-blue-600">
              FivePigs Store Admin
            </h1>
            <p className="text-sm text-gray-500">
              Quản lý hệ thống
            </p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-700">
              Admin: <b>{user.name}</b>
            </span>

            <Link
              to="/"
              className="text-blue-600 text-sm hover:underline"
            >
              Về trang chủ
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="flex">


        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)]">
          <nav className="p-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-10">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

