import { createContext, useContext, useEffect, useState } from 'react';
import { initialOrders } from '../data/mockData';

const OrderContext = createContext();

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

// BỔ SUNG: Hằng số trạng thái thanh toán
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);

  // Lấy toàn bộ đơn hàng từ localStorage/mockData khi khởi động web
  useEffect(() => {
    const storedOrders = localStorage.getItem('fivepigs_orders');
    let parsedOrders = initialOrders;

    if (storedOrders) {
      try {
        parsedOrders = JSON.parse(storedOrders);
      } catch (e) {
        console.error("Error parsing stored orders, resetting to initial", e);
      }
    } else {
      localStorage.setItem('fivepigs_orders', JSON.stringify(initialOrders));
    }

    setOrders(parsedOrders);
  }, []);
  
  // Tạo đơn hàng mới
  const createOrder = async (orderData) => {
    const newOrder = {
      ...orderData,
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: orderData.status || ORDER_STATUS.PENDING
    };

    try {
      const updatedOrders = [...orders, newOrder];
      setOrders(updatedOrders);
      localStorage.setItem('fivepigs_orders', JSON.stringify(updatedOrders));
      return newOrder.id;
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      return null;
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, status) => {
    try {
      const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
      setOrders(updatedOrders);
      localStorage.setItem('fivepigs_orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    }
  };

  // BỔ SUNG: Cập nhật trạng thái thanh toán
  const updatePaymentStatus = async (orderId, paymentStatus) => {
    try {
      const updatedOrders = orders.map((o) => (o.id === orderId ? { ...o, paymentStatus } : o));
      setOrders(updatedOrders);
      localStorage.setItem('fivepigs_orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    }
  };

  // Lọc đơn hàng theo ID người dùng
  const getUserOrders = (userId) => {
    return orders
      .filter((o) => String(o.userId) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Lấy chi tiết 1 đơn hàng
  const getOrder = (orderId) => orders.find((o) => String(o.id) === String(orderId));

  // Hủy đơn hàng
  const cancelOrder = (orderId) => updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);

  return (
    <OrderContext.Provider value={{ 
      orders, 
      createOrder, 
      updateOrderStatus, 
      updatePaymentStatus, // BỔ SUNG: Bắn hàm này ra ngoài để Admin dùng
      getUserOrders, 
      getOrder, 
      cancelOrder 
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
}