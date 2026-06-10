import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, LayoutDashboard, NotebookPen } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useState } from "react";

const logoImage = "";

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
        <Link to="/" className="brand">
          <div className="brand__logo">
            {logoImage ? (
              <img
                src={logoImage}
                alt="FivePigs Store"
                style={{ width: 28, height: 28 }}
              />
            ) : (
              "🐷"
            )}
          </div>
          <div>FivePigs Store</div>
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
                <button className="btn" onClick={() => navigate("/admin")}>
                  <LayoutDashboard size={18} style={{ marginRight: 8 }} />
                  Admin
                </button>
              ) : (
                <>
                  {/* PROFILE */}
                  <button className="btn" onClick={() => navigate("/profile")}>
                    <User size={18} style={{ marginRight: 8 }} />
                    Profile
                  </button>

                  <button
                    className="btn"
                    onClick={() => navigate("/cart")}
                    style={{ position: "relative" }}
                  >
                    <ShoppingCart size={18} style={{ marginRight: 8 }} />
                    Cart
                    {totalItems > 0 && (
                      <span className="cartBadge">{totalItems}</span>
                    )}
                  </button>

                  <button className="btn" onClick={() => navigate("/orders")}>
                    <NotebookPen size={18} style={{ marginRight: 8 }} />
                    Orders
                  </button>
                </>
              )}

              <button className="btn" onClick={handleLogout}>
                <LogOut size={18} style={{ marginRight: 8 }} />
                Logout
              </button>
            </>
          ) : (
            <button
              className="btn btn--primary"
              onClick={() => navigate("/login")}
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