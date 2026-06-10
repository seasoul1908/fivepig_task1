import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../contexts/ProductContext";
import { TrendingUp, Shield, Truck, CreditCard } from "lucide-react";
import "../styles/home.css";

export function Home() {
  const { products, categories, loading } = useProducts();

  // Get first 6 products
  const featuredProducts = products.slice(0, 6);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem' }}>
        Loading FivePigs Store data...
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero__inner">
          <h1>Welcome to FivePigs Store</h1>
          <p>Modern fashion, youthful style</p>
          <Link to="/products" className="hero__btn">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container features__grid">
          <div className="feature">
            <div className="feature__icon">
              <Truck />
            </div>
            <h3>Free Shipping</h3>
            <p>On orders over 500,000đ</p>
          </div>

          <div className="feature">
            <div className="feature__icon">
              <Shield />
            </div>
            <h3>Quality Assured</h3>
            <p>100% money-back guarantee</p>
          </div>

          <div className="feature">
            <div className="feature__icon">
              <CreditCard />
            </div>
            <h3>Secure Payment</h3>
            <p>Safe and encrypted</p>
          </div>

          <div className="feature">
            <div className="feature__icon">
              <TrendingUp />
            </div>
            <h3>Latest Trends</h3>
            <p>Constantly updated</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Featured Products</h2>
            <p>Discover our hottest fashion items</p>
          </div>

          <div className="products__grid">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No products available.</p>
            )}
          </div>

          <div className="center mt-24">
            <Link to="/products" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section section--white">
        <div className="container">
          <div className="section__head">
            <h2>Product Categories</h2>
            <p>Browse by your favorite categories</p>
          </div>

          <div className="categories__grid">
            {categories && categories.length > 0 && categories.map((category) => {
              const catName = category.name || category;
              const catId = category.id || category;

              return (
                <Link
                  key={catId}
                  to={`/products?category=${encodeURIComponent(catName)}`}
                  className="category__item"
                >
                  {catName}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}