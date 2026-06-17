import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';

export function OrderDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getOrder, cancelOrder } = useOrders();
  const order = getOrder(id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/orders" className="text-blue-600 hover:underline">
            Back to order list
          </Link>
        </div>
      </div>
    );
  }

  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrder(order.id);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-purple-100 text-purple-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canReview = order.status === 'Shipped' || order.status === 'Delivered';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/orders" className="text-blue-600 hover:underline">
            ← Back to order list
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">Order Details</h1>
              <p className="text-gray-600">Order ID: {order.id}</p>
              <p className="text-sm text-gray-500">Placed on: {formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-4 py-2 rounded-full font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="border-t border-b py-6 mb-6">
            <h2 className="font-semibold mb-4">Products</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} × {item.quantity}
                    </p>
                    <p className="text-blue-600 font-semibold mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                  
                  {canReview && (
                    <Link
                      to={`/products/${item.product.id}/reviews`}
                      className="text-sm font-medium text-green-600 hover:text-green-700 border border-green-600 px-4 py-2 rounded-md transition hover:bg-green-50"
                    >
                      Review
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="font-semibold mb-3">Shipping Information</h2>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="font-medium">{order.shippingInfo.name}</p>
                <p>{order.shippingInfo.phone}</p>
                <p>{order.shippingInfo.address}, {order.shippingInfo.city}</p>
              </div>
            </div>
            
            {/* ĐÃ CẬP NHẬT: Xử lý hiển thị chuẩn xác cho phương thức và trạng thái thanh toán */}
            <div>
              <h2 className="font-semibold mb-3">Payment Method</h2>
              <div className="bg-gray-50 p-4 rounded-lg text-sm">
                <p className="text-gray-800 font-medium">
                  {order.paymentMethod === 'cod' && 'Cash on Delivery (COD)'}
                  {order.paymentMethod === 'qr' && 'Bank transfer / Scan QR Code'}
                  {order.paymentMethod === 'card' && 'Credit / Debit Card'}
                </p>
                <p className={`font-semibold mt-1 
                  ${order.paymentStatus === 'completed' ? 'text-green-600' : ''}
                  ${order.paymentStatus === 'pending' ? 'text-yellow-600' : ''}
                  ${order.paymentStatus === 'failed' ? 'text-red-600' : ''}
                `}>
                  Status: {
                    order.paymentStatus === 'completed' ? 'Paid (Paid)' : 
                    order.paymentStatus === 'failed' ? 'Failed (Failed)' : 
                    'Unpaid (Pending payment)'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(order.totalPrice)}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {order.status === 'Pending' && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium shadow-sm"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}