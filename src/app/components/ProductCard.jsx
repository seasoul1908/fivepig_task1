import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";

export function ProductCard({ product }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__thumb">
        <img
          src={product.image}
          alt={product.name}
          className="product-card__img"
        />
      </Link>

      <div className="product-card__body">
        <div className="product-card__top">
          <span className="product-card__tag">
            {product.category}
          </span>

          <div className="product-card__rating">
            <Star className="product-card__star" />
            <span>{product.rating}</span>
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="product-card__name"
        >
          {product.name}
        </Link>

        <p className="product-card__desc">
          {product.description}
        </p>

        <div className="product-card__bottom">
          <span className="product-card__price">
            {formatPrice(product.price)}
          </span>

          <Link
            to={`/products/${product.id}`}
            className="product-card__btn"
          >
            <ShoppingCart className="product-card__btn-icon" />
            Xem
          </Link>
        </div>
      </div>
    </div>
  );
}