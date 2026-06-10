// Import custom hook để lấy danh sách sản phẩm từ ProductContext
import { useProducts } from '../../contexts/ProductContext';
// Import custom hook để lấy danh sách đơn hàng từ OrderContext
import { useOrders } from '../../contexts/OrderContext';
// Import các icon dùng để hiển thị UI dashboard
import { Package, ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';

// Khai báo component AdminDashboard
export function AdminDashboard() {
  // Lấy dữ liệu products từ context
  const { products } = useProducts();
  // Lấy dữ liệu orders từ context
  const { orders } = useOrders();

  // Tính tổng doanh thu (bỏ các đơn bị Cancelled)
  const totalRevenue = orders
  // lọc đơn hợp lệ
    .filter(o => o.status !== 'Cancelled')
    // cộng tổng tiền
    .reduce((sum, order) => sum + order.totalPrice, 0);
  
    // Đếm tổng số sản phẩm
  const totalProducts = products.length;
  // Đếm tổng số đơn hàng
  const totalOrders = orders.length;
  // Đếm số đơn đang Pending (chờ xử lý)
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Hàm format tiền theo định dạng Việt Nam (VND)
  const formatPrice = (price) => {
        // Sử dụng Intl để format số thành tiền VND
    return new Intl.NumberFormat('vi-VN', {
      // Lấy 5 đơn hàng gần nhất (hiển thị trên dashboard)
      style: 'currency',
        // Render giao diện dashboard
      currency: 'VND'
      // Container chính với khoảng cách giữa các phần tử
    }).format(price);
  };

  const recentOrders = orders.slice(0, 5);

  return (
  <div className="space-y-8">
    
    {/* Title */}
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
      <p className="text-gray-500 mt-1">Tổng quan hoạt động hệ thống</p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      
      {/* Revenue */}
      {/* Icon doanh thu */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-sm text-gray-500">Tổng doanh thu</p>
        <h2 className="text-2xl font-bold text-gray-800 mt-1">
          {formatPrice(totalRevenue)}
        </h2>
      </div>

      {/* Orders */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
        <div className="p-3 bg-green-100 rounded-xl mb-4 w-fit">
          <ShoppingBag className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm text-gray-500">Tổng đơn hàng</p>
        <h2 className="text-2xl font-bold text-gray-800">
          {totalOrders}
        </h2>
        <p className="text-sm text-yellow-500 mt-1">
          {pendingOrders} đang chờ xử lý
        </p>
      </div>

      {/* Products */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
        <div className="p-3 bg-purple-100 rounded-xl mb-4 w-fit">
          <Package className="w-6 h-6 text-purple-600" />
        </div>
        <p className="text-sm text-gray-500">Sản phẩm</p>
        <h2 className="text-2xl font-bold text-gray-800">
          {totalProducts}
        </h2>
      </div>

      {/* Stock */}
      <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
        <div className="p-3 bg-yellow-100 rounded-xl mb-4 w-fit">
          <Users className="w-6 h-6 text-yellow-600" />
        </div>
        <p className="text-sm text-gray-500">Tồn kho</p>
        <h2 className="text-2xl font-bold text-gray-800">
          {products.reduce((sum, p) => sum + p.stock, 0)}
        </h2>
      </div>

    </div>

    {/* Recent Orders */}
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-700">
          Đơn hàng gần đây
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Mã đơn</th>
              <th className="px-6 py-3 text-left">Khách hàng</th>
              <th className="px-6 py-3 text-left">Tổng tiền</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Ngày đặt</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {recentOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-semibold text-gray-700">
                  #{order.id}
                </td>

                <td className="px-6 py-4">
                  {order.shippingInfo.name}
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  {formatPrice(order.totalPrice)}
                </td>

                <td className="px-6 py-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium
                    ${
                      order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : order.status === 'Confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : order.status === 'Shipped'
                        ? 'bg-purple-100 text-purple-800'
                        : order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {order.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
}