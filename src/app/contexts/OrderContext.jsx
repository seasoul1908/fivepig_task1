import { createContext, useContext, useEffect, useState } from 'react';

const OrderContext = createContext();

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled'
};

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const API_URL = 'http://localhost:9999/orders';

  // Lấy toàn bộ đơn hàng từ database khi khởi động web
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu đơn hàng:", error);
      }
    };
    fetchOrders();
  }, []);
  
  // Tạo đơn hàng mới (Gửi POST lên database)
  const createOrder = async (orderData) => {
    const newOrder = {
      ...orderData,
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: orderData.status || ORDER_STATUS.PENDING
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newOrder),
      });

      const savedOrder = await response.json();
      
      // Cập nhật lại state cục bộ để giao diện hiển thị ngay lập tức
      setOrders((prev) => [...prev, savedOrder]);
      return savedOrder.id;
    } catch (error) {
      console.error("Lỗi khi lưu đơn hàng:", error);
      return null;
    }
  };

  // Cập nhật trạng thái đơn hàng (Dùng PATCH để sửa 1 phần dữ liệu)
  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`${API_URL}/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      // Cập nhật lại UI
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
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
    <OrderContext.Provider value={{ orders, createOrder, updateOrderStatus, getUserOrders, getOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within an OrderProvider');
  return ctx;
}