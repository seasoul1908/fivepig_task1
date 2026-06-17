import { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

// Khai báo chung cổng 9999 cho gọn
const API_URL = 'http://localhost:9999';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Tải dữ liệu ban đầu
  const fetchFivePigsData = async () => {
    try {
      setLoading(true);
      const resProducts = await fetch(`${API_URL}/products`);
      const dataProducts = await resProducts.json();
      
      const resCategories = await fetch(`${API_URL}/categories`);
      const dataCategories = await resCategories.json();

      setProducts(dataProducts);
      setCategories(dataCategories);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu từ database.json:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFivePigsData();
  }, []);

  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  // 2. Các hàm lấy và gửi đánh giá (Reviews)
  const getReviewsByProductId = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/reviews?productId=${String(productId)}`);
      return await res.json();
    } catch (error) {
      console.error("Lỗi khi lấy đánh giá:", error);
      return [];
    }
  };

  const addReview = async (newReview) => {
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      return await res.json();
    } catch (error) {
      console.error("Lỗi khi gửi đánh giá:", error);
      return null;
    }
  };

  // ========================================================
  // 3. CÁC HÀM CRUD DÀNH CHO ADMIN (Thêm, Sửa, Xóa Sản Phẩm)
  // ========================================================

  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const newProduct = await res.json();
      
      // Cập nhật lại state để giao diện tự refresh
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      throw error;
    }
  };

  const updateProduct = async (productId, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      const data = await res.json();
      
      // Cập nhật lại mảng products trên giao diện
      setProducts(products.map((p) => (String(p.id) === String(productId) ? data : p)));
      return data;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE'
      });
      
      // Cắt bỏ sản phẩm vừa xóa khỏi giao diện
      setProducts(products.filter((p) => String(p.id) !== String(productId)));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      throw error;
    }
  };

  // ========================================================
  // TRUYỀN TOÀN BỘ CÁC HÀM RA NGOÀI QUA VALUE
  // ========================================================
  const value = {
    products,
    setProducts,
    categories,
    loading,
    getProduct,
    getReviewsByProductId,
    addReview,
    // Đã thêm 3 hàm quan trọng này cho AdminProducts
    addProduct,
    updateProduct,
    deleteProduct
  };
  
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