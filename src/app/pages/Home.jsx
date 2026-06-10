import { Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../contexts/ProductContext";
import { TrendingUp, Shield, Truck, CreditCard } from "lucide-react";
import "../styles/home.css";

export function Home() {
  // Lấy danh sách sản phẩm, danh mục và trạng thái loading từ Context
  const { products, categories, loading } = useProducts();
  
  // Lấy 6 sản phẩm đầu tiên để làm sản phẩm nổi bật
  const featuredProducts = products.slice(0, 6);

  // Hiển thị thông báo trong lúc chờ lấy dữ liệu từ json-server
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0', fontSize: '1.2rem' }}>
        Đang tải dữ liệu FivePigs Store...
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero__inner">
          <h1>Chào mừng đến FivePigs Store</h1>
          <p>Thời trang hiện đại, phong cách trẻ trung</p>
          <Link to="/products" className="hero__btn">
            Khám phá ngay
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
            <h3>Giao hàng miễn phí</h3>
            <p>Đơn hàng trên 500.000đ</p>
          </div>

          <div className="feature">
            <div className="feature__icon">
              <Shield />
            </div>
            <h3>Đảm bảo chất lượng</h3>
            <p>Hoàn tiền 100%</p>
          </div>

          <div className="feature">
            <div className="feature__icon">
              <CreditCard />
            </div>
            <h3>Thanh toán an toàn</h3>
            <p>Bảo mật thông tin</p>
          </div>

          <div className="feature">
            <div className="feature__icon">
              <TrendingUp />
            </div>
            <h3>Xu hướng mới nhất</h3>
            <p>Cập nhật liên tục</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <h2>Sản phẩm nổi bật</h2>
            <p>Khám phá những sản phẩm thời trang hot nhất</p>
          </div>

          <div className="products__grid">
            {/* Kiểm tra mảng có dữ liệu thì mới hiển thị, tránh lỗi */}
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>Chưa có sản phẩm nào.</p>
            )}
          </div>

          <div className="center mt-24">
            <Link to="/products" className="btn-primary">
              Xem tất cả sản phẩm
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section section--white">
        <div className="container">
          <div className="section__head">
            <h2>Danh mục sản phẩm</h2>
            <p>Tìm kiếm theo danh mục yêu thích của bạn</p>
          </div>

          <div className="categories__grid">
            {/* Xử lý linh hoạt: Nếu category trong DB là đối tượng {id, name} thì lấy name,
              nếu là chuỗi chữ bình thường thì lấy thẳng nó.
            */}
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