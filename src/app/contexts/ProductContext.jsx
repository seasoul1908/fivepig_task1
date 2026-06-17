import { createContext, useContext, useEffect, useState } from 'react';

const ProductContext = createContext();

// Common port configuration
const API_URL = 'http://localhost:9999';

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch initial data
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
      console.error("Error fetching data from database.json:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFivePigsData();
  }, []);

  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  // 2. Functions to get and submit reviews
  const getReviewsByProductId = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/reviews?productId=${String(productId)}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching reviews:", error);
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
      console.error("Error submitting review:", error);
      return null;
    }
  };

  // 3. ADMIN CRUD FUNCTIONS (Add, Update, Delete Products)
  const addProduct = async (productData) => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      const newProduct = await res.json();
      
      // Update state to refresh UI
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (error) {
      console.error("Error adding product:", error);
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
      
      // Update products array in UI
      setProducts(products.map((p) => (String(p.id) === String(productId) ? data : p)));
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const deleteProduct = async (productId) => {
    try {
      // Fetch all orders from database to check for dependencies
      const resOrders = await fetch(`${API_URL}/orders`);
      const orders = await resOrders.json();
      
      // Check if the product exists in any order
      const isProductInOrder = orders.some(order =>
        order.items?.some(item => String(item.product.id) === String(productId))
      );
      
      if (isProductInOrder) {
        // Prevent deletion if the product is linked to an order
        throw new Error("Cannot delete! This product is currently in an existing order.");
      }
      
      // Delete product if validation passes
      await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE'
      });
      
      // Remove deleted product from UI state
      setProducts(products.filter((p) => String(p.id) !== String(productId)));
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error; // Throw error to be caught by UI
    }
  };

  // 4. CATEGORIES CRUD (Add, Update, Delete Categories)
  const addCategory = async (categoryName) => {
    try {
      const newCategory = {
        id: Date.now(), // Create temporary ID using timestamp
        name: categoryName
      };
      
      const res = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      const data = await res.json();
      
      setCategories(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Error adding category:", error);
      throw error;
    }
  };

  const updateCategory = async (categoryId, updatedName) => {
    try {
      const res = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: updatedName })
      });
      const data = await res.json();
      
      setCategories(categories.map((c) => (c.id === categoryId ? data : c)));
      return data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE'
      });
      
      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };

  // Pass all state and functions to consumers
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
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory
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