import { createContext, useContext, useEffect, useState } from 'react';
import { initialProducts, initialCategories, initialReviews } from '../data/mockData';

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage or fallback to initialMockData
    const storedProducts = localStorage.getItem('fivepigs_products');
    const storedCategories = localStorage.getItem('fivepigs_categories');
    const storedReviews = localStorage.getItem('fivepigs_reviews');

    let parsedProducts = initialProducts;
    let parsedCategories = initialCategories;
    let parsedReviews = initialReviews;

    if (storedProducts) {
      try {
        parsedProducts = JSON.parse(storedProducts);
      } catch (e) {
        console.error("Error parsing stored products, resetting to initial", e);
      }
    } else {
      localStorage.setItem('fivepigs_products', JSON.stringify(initialProducts));
    }

    if (storedCategories) {
      try {
        parsedCategories = JSON.parse(storedCategories);
      } catch (e) {
        console.error("Error parsing stored categories, resetting to initial", e);
      }
    } else {
      localStorage.setItem('fivepigs_categories', JSON.stringify(initialCategories));
    }

    if (storedReviews) {
      try {
        parsedReviews = JSON.parse(storedReviews);
      } catch (e) {
        console.error("Error parsing stored reviews, resetting to initial", e);
      }
    } else {
      localStorage.setItem('fivepigs_reviews', JSON.stringify(initialReviews));
    }

    setProducts(parsedProducts);
    setCategories(parsedCategories);
    setReviews(parsedReviews);
    setLoading(false);
  }, []);

  const getProduct = (id) => products.find((p) => String(p.id) === String(id));

  const getReviewsByProductId = async (productId) => {
    // Filter reviews matching productId (handling potential string/number mismatch)
    return reviews.filter((r) => String(r.productId) === String(productId));
  };

  const addReview = async (newReview) => {
    const reviewWithId = {
      ...newReview,
      id: newReview.id || String(Math.random().toString(36).substr(2, 9))
    };
    const updatedReviews = [...reviews, reviewWithId];
    setReviews(updatedReviews);
    localStorage.setItem('fivepigs_reviews', JSON.stringify(updatedReviews));

    // Also update product's review count and average rating
    const prodReviews = updatedReviews.filter((r) => String(r.productId) === String(newReview.productId));
    const totalRating = prodReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    const avgRating = prodReviews.length > 0 ? parseFloat((totalRating / prodReviews.length).toFixed(1)) : 0;

    const updatedProducts = products.map((p) => {
      if (String(p.id) === String(newReview.productId)) {
        return {
          ...p,
          reviews: prodReviews.length,
          rating: avgRating
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    localStorage.setItem('fivepigs_products', JSON.stringify(updatedProducts));

    return reviewWithId;
  };

  // Product management for Admin
  const addProduct = async (product) => {
    const updatedProducts = [...products, product];
    setProducts(updatedProducts);
    localStorage.setItem('fivepigs_products', JSON.stringify(updatedProducts));
    return product;
  };

  const updateProduct = async (productId, updatedProduct) => {
    const updatedProducts = products.map((p) =>
      String(p.id) === String(productId) ? { ...p, ...updatedProduct } : p
    );
    setProducts(updatedProducts);
    localStorage.setItem('fivepigs_products', JSON.stringify(updatedProducts));
    return updatedProduct;
  };

  const deleteProduct = async (productId) => {
    const updatedProducts = products.filter((p) => String(p.id) !== String(productId));
    setProducts(updatedProducts);
    localStorage.setItem('fivepigs_products', JSON.stringify(updatedProducts));
    
    // Clean up reviews associated with this product
    const updatedReviews = reviews.filter((r) => String(r.productId) !== String(productId));
    setReviews(updatedReviews);
    localStorage.setItem('fivepigs_reviews', JSON.stringify(updatedReviews));
  };

  // Category management for Admin
  const addCategory = async (categoryName) => {
    const newCategory = {
      id: String(Date.now()),
      name: categoryName
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('fivepigs_categories', JSON.stringify(updatedCategories));
    return newCategory;
  };

  const deleteCategory = async (categoryId) => {
    const updatedCategories = categories.filter((c) => String(c.id) !== String(categoryId));
    setCategories(updatedCategories);
    localStorage.setItem('fivepigs_categories', JSON.stringify(updatedCategories));
  };

  const value = {
    products,
    setProducts,
    categories,
    getProduct,
    loading,
    getReviewsByProductId,
    addReview,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
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