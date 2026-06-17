import { useState } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { Eye, CreditCard, Wallet, QrCode } from 'lucide-react'; // Bổ sung icon
import { toast } from 'sonner';

export function AdminOrders() {
  // Bổ sung lấy thêm updatePaymentStatus
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully!');
    } catch (error) {
      toast.error('Failed to update order status!');
    }
  };

  // BỔ SUNG: Hàm xử lý cập nhật trạng thái thanh toán
  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      await updatePaymentStatus(orderId, newStatus);
      toast.success('Payment status updated successfully!');
    } catch (error) {
      toast.error('Failed to update payment status!');
    }
  };

  // BỔ SUNG: Helper hiển thị tên phương thức thanh toán cho đẹp
  const getPaymentMethodText = (method) => {
    if (method === 'qr') return 'QR Code';
    if (method === 'card') return 'Credit Card';
    return 'COD';
  };

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {selectedOrderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Order Details</h2>
                <p className="text-gray-600">{selectedOrderData.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg h-full">
                    <p className="font-medium">{selectedOrderData.shippingInfo?.name || '-'}</p>
                    <p className="text-sm text-gray-600">{selectedOrderData.shippingInfo?.phone || '-'}</p>
                    <p className="text-sm text-gray-600">
                      {selectedOrderData.shippingInfo?.address || '-'}, {selectedOrderData.shippingInfo?.city || '-'}, {selectedOrderData.shippingInfo?.postalCode || '-'}
                    </p>
                  </div>
                </div>

                {/* BỔ SUNG: Thêm khối hiển thị phương thức thanh toán trong Popup */}
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-600">Method:</span>
                      <span className="font-medium flex items-center gap-1">
                        {selectedOrderData.paymentMethod === 'qr' && <QrCode className="w-4 h-4 text-blue-600"/>}
                        {selectedOrderData.paymentMethod === 'card' && <CreditCard className="w-4 h-4 text-blue-600"/>}
                        {selectedOrderData.paymentMethod === 'cod' && <Wallet className="w-4 h-4 text-gray-600"/>}
                        {getPaymentMethodText(selectedOrderData.paymentMethod)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${selectedOrderData.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : ''}
                        ${selectedOrderData.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : ''}
                        ${selectedOrderData.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}>
                        {selectedOrderData.paymentStatus?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Products</h3>
                <div className="space-y-3">
                  {(selectedOrderData.items || []).map((item, index) => (
                    <div key={index} className="flex gap-4 bg-gray-50 p-3 rounded-lg">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name}</p>
                        <p className="text-sm text-gray-600">
                          Size: {item.size} × {item.quantity}
                        </p>
                        <p className="text-blue-600 font-semibold">
                          {formatPrice((item.product?.price || 0) * (item.quantity || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-semibold mb-2">Total</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatPrice(selectedOrderData.totalPrice)}
                  </p>
                </div>
                
                {/* Dời nút Update Status cũ xuống đây cho gọn */}
                <div className="w-48">
                  <h3 className="font-semibold mb-2 text-sm text-gray-600">Order Status</h3>
                  <select
                    value={selectedOrderData.status}
                    onChange={(e) => handleStatusChange(selectedOrderData.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Order ID</th>
                <th className="text-left py-3 px-4">Customer</th>
                <th className="text-left py-3 px-4">Products</th>
                <th className="text-left py-3 px-4">Total</th>
                
                {/* BỔ SUNG: 2 Cột mới */}
                <th className="text-left py-3 px-4">Pay Method</th>
                <th className="text-left py-3 px-4">Pay Status</th>
                
                <th className="text-left py-3 px-4">Order Status</th>
                <th className="text-left py-3 px-4">Order Date</th>
                <th className="text-left py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{order.id}</td>
                  <td className="py-3 px-4">
                    <div className="min-w-[120px]">
                      <p className="font-medium">{order.shippingInfo?.name || '-'}</p>
                      <p className="text-sm text-gray-600">{order.shippingInfo?.phone || '-'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm whitespace-nowrap">{order.items?.length || 0} products</p>
                  </td>
                  <td className="py-3 px-4 font-semibold whitespace-nowrap">{formatPrice(order.totalPrice)}</td>
                  
                  {/* BỔ SUNG: Render Phương thức thanh toán */}
                  <td className="py-3 px-4">
                    <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                      {getPaymentMethodText(order.paymentMethod)}
                    </span>
                  </td>

                  {/* BỔ SUNG: Render Dropdown chọn Trạng thái thanh toán */}
                  <td className="py-3 px-4">
                    <select
                      value={order.paymentStatus || 'pending'}
                      onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                        order.paymentStatus === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                        order.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'Confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Shipped'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-sm whitespace-nowrap">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}