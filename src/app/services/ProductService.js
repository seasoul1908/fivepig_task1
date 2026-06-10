import { api } from './api';

export class ProductService {
  static async getProducts() {
    return api.get('/products');
  }

  static async getCategories() {
    return api.get('/categories');
  }

  static async createProduct(product) {
    return api.post('/products', product);
  }

  static async updateProduct(productId, product) {
    return api.put(`/products/${productId}`, product);
  }

  static async deleteProduct(productId) {
    return api.delete(`/products/${productId}`);
  }

  static async createCategory(category) {
    return api.post('/categories', category);
  }

  static async deleteCategory(categoryId) {
    return api.delete(`/categories/${categoryId}`);
  }
}