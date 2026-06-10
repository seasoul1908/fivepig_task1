import { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // GỌI API TỪ DATABASE KHI KHỞI CHẠY APP
  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        setIsLoading(true);
        // Dùng Promise.all để gọi 2 API cùng lúc cho nhanh
        const [resProducts, resCategories] = await Promise.all([
          fetch("http://localhost:3000/products"),
          fetch("http://localhost:3000/categories")
        ]);

        const dataProducts = await resProducts.json();
        const dataCategories = await resCategories.json();

        setProducts(dataProducts);
        setCategories(dataCategories);
      } catch (error) {
        console.error("Lỗi kết nối database:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabase();
  }, []);

  // Hàm tiện ích tìm sản phẩm theo ID (Dùng cho trang Chi tiết sản phẩm)
  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  const value = { products, categories, isLoading, getProduct };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
}