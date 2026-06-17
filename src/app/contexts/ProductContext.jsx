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
      //Fetch all orders from database
      const resOrders = await fetch(`${API_URL}/orders`);
      const orders = await resOrders.json();
      //Check if the product exists in any order
      const isProductInOrder = orders.some(order =>
        order.items?.some(item => String(item.product.id) === String(productId))
      );
      if (isProductInOrder) {
        // Prevent deletion if the product is linked to an order
        throw new Error("Cannot delete! This product is currently in an existing order.");
      }
      // 3. Delete product if validation passes
      await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE'
      });
      // Update UI state
      setProducts(products.filter((p) => String(p.id) !== String(productId)));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error; // Throw error to be caught by UI
    }
  };

  const value = {
    products,
    setProducts,
    categories,
    loading,
    getProduct,
    getReviewsByProductId,
    addReview,
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