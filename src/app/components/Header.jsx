import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, LayoutDashboard, NotebookPen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";
import logoImage from '../../assets/fivepigslogo.png';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  return (
    <header className="header">
      <div className="container header__inner">
        {/* Logo */}
        <Link to="/" className="brand" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <img
            src={logoImage}
            alt="FivePigs Store"
            style={{ height: 36, width: "auto", objectFit: "contain" }}
          />
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            FivePigs Store
          </div>
        </Link>

        {/* Search */}
        <div className="search">
          <form onSubmit={handleSearch} className="search__box">
            <span className="search__icon">🔎</span>
            <input
              className="search__input"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Navigation */}
        <nav className="header__actions">
          {user ? (
            <>
              <span
                style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}
              >
                Hello, {user.name}
              </span>

              {isAdmin ? (
                <button
                  className="btn"
                  onClick={() => navigate("/admin")}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <LayoutDashboard size={18} style={{ marginRight: 8 }} />
                  Admin
                </button>
              ) : (
                <>
                  {/* PROFILE */}
                  <button
                    className="btn"
                    onClick={() => navigate("/profile")}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <User size={18} style={{ marginRight: 8 }} />
                    Profile
                  </button>

                  {/* CART */}
                  <button
                    className="btn"
                    onClick={() => navigate("/cart")}
                    style={{ display: "flex", alignItems: "center", position: "relative" }}
                  >
                    <ShoppingCart size={18} style={{ marginRight: 8 }} />
                    Cart
                    {totalItems > 0 && (
                      <span className="cartBadge">{totalItems}</span>
                    )}
                  </button>

                  {/* ORDERS */}
                  <button
                    className="btn"
                    onClick={() => navigate("/orders")}
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    <NotebookPen size={18} style={{ marginRight: 8 }} />
                    Orders
                  </button>
                </>
              )}

              {/* LOGOUT */}
              <button
                className="btn"
                onClick={handleLogout}
                style={{ display: "flex", alignItems: "center" }}
              >
                <LogOut size={18} style={{ marginRight: 8 }} />
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => navigate("/login")}
              style={{ display: "flex", alignItems: "center" }}
            >
              <User size={18} style={{ marginRight: 8 }} />
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}