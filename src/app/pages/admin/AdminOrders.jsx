import { useState } from 'react';
import { useOrders } from '../../contexts/OrderContext';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

export function AdminOrders() {
  const { orders, updateOrderStatus } = useOrders();
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
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại!');
    }
  };

  const selectedOrderData = orders.find((o) => o.id === selectedOrder);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Quản lý đơn hàng</h1>

      {selectedOrderData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Chi tiết đơn hàng</h2>
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
              <div>
                <h3 className="font-semibold mb-2">Thông tin khách hàng</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{selectedOrderData.shippingInfo?.name || '-'}</p>
                  <p className="text-sm text-gray-600">{selectedOrderData.shippingInfo?.phone || '-'}</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrderData.shippingInfo?.address || '-'}, {selectedOrderData.shippingInfo?.city || '-'}, {selectedOrderData.shippingInfo?.postalCode || '-'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sản phẩm</h3>
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

              <div>
                <h3 className="font-semibold mb-2">Tổng cộng</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {formatPrice(selectedOrderData.totalPrice)}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cập nhật trạng thái</h3>
                <select
                  value={selectedOrderData.status}
                  onChange={(e) => handleStatusChange(selectedOrderData.id, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4">Mã đơn</th>
                <th className="text-left py-3 px-4">Khách hàng</th>
                <th className="text-left py-3 px-4">Sản phẩm</th>
                <th className="text-left py-3 px-4">Tổng tiền</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-left py-3 px-4">Ngày đặt</th>
                <th className="text-left py-3 px-4">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium">{order.shippingInfo?.name || '-'}</p>
                      <p className="text-sm text-gray-600">{order.shippingInfo?.phone || '-'}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm">{order.items?.length || 0} sản phẩm</p>
                  </td>
                  <td className="py-3 px-4 font-semibold">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs border-none ${
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
                  <td className="py-3 px-4 text-sm">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => setSelectedOrder(order.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
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
            Chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  );
}
