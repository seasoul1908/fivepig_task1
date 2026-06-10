import { api } from './api';

export class OrderService {
  static async getOrders() {
    return api.get('/orders');
  }

  static async createOrder(order) {
    return api.post('/orders', order);
  }

  static async updateOrder(orderId, order) {
    return api.put(`/orders/${orderId}`, order);
  }

  static async updateOrderStatus(orderId, status) {
    return api.patch(`/orders/${orderId}`, { status });
  }
}