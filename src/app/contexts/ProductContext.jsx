import { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  // Thêm state loading để lúc dữ liệu đang tải, web không bị giật hoặc lỗi
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hàm gọi API từ json-server
    const fetchFivePigsData = async () => {
      try {
        setLoading(true);
        // Gọi dữ liệu sản phẩm
        const resProducts = await fetch('http://localhost:9999/products');
        const dataProducts = await resProducts.json();
        
        // Gọi dữ liệu danh mục
        const resCategories = await fetch('http://localhost:9999/categories');
        const dataCategories = await resCategories.json();

        // Cập nhật vào kho chứa chung
        setProducts(dataProducts);
        setCategories(dataCategories);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu từ database.json:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFivePigsData();
  }, []);

  // Giữ nguyên hàm này để trang ProductDetail vẫn tìm được sản phẩm
  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  // 1. Hàm lấy danh sách đánh giá theo ID sản phẩm
  const getReviewsByProductId = async (productId) => {
    try {
      // Ép kiểu productId sang String để khớp với database của bạn
      const res = await fetch(`http://localhost:9999/reviews?productId=${String(productId)}`);
      return await res.json();
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      return []; // Nếu lỗi, trả về mảng rỗng để web không bị crash
    }
  };

  // 2. Hàm thêm một đánh giá mới vào database
  const addReview = async (newReview) => {
    try {
      const res = await fetch(`http://localhost:9999/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview)
      });
      return await res.json(); // json-server sẽ tự động thêm 'id' và trả về object vừa tạo
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      return null;
    }
  };

  // Truyền thêm 2 hàm mới vào value
  const value = {
    products,
    setProducts,
    categories,
    getProduct,
    loading,
    getReviewsByProductId, // Khai báo thêm ở đây
    addReview              // Khai báo thêm ở đây
  };
  
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

// Giữ nguyên custom hook của bạn
export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
}