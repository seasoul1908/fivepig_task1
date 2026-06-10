// Import custom hook to get the product list from ProductContext
import { useProducts } from '../../contexts/ProductContext';
// Import custom hook to get the order list from OrderContext
import { useOrders } from '../../contexts/OrderContext';
// Import icons used to display dashboard UI
import { Package, ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';

// Declare AdminDashboard component
export function AdminDashboard() {
  // Get products data from context
  const { products } = useProducts();
  // Get orders data from context
  const { orders } = useOrders();

  // Calculate total revenue (excluding Cancelled orders)
  const totalRevenue = orders
    // Filter valid orders
    .filter(o => o.status !== 'Cancelled')
    // Sum total price
    .reduce((sum, order) => sum + order.totalPrice, 0);
  
  // Count total products
  const totalProducts = products.length;
  // Count total orders
  const totalOrders = orders.length;
  // Count Pending orders (waiting for processing)
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Function to format currency to Vietnamese format (VND)
  const formatPrice = (price) => {
    // Use Intl to format number as VND currency
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Get the 5 most recent orders (to display on the dashboard)
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">System activity overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm text-gray-500">Total Revenue</p>
          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {formatPrice(totalRevenue)}
          </h2>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="p-3 bg-green-100 rounded-xl mb-4 w-fit">
            <ShoppingBag className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {totalOrders}
          </h2>
          <p className="text-sm text-yellow-500 mt-1">
            {pendingOrders} pending
          </p>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="p-3 bg-purple-100 rounded-xl mb-4 w-fit">
            <Package className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-500">Products</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {totalProducts}
          </h2>
        </div>

        {/* Stock */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100">
          <div className="p-3 bg-yellow-100 rounded-xl mb-4 w-fit">
            <Users className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-sm text-gray-500">In Stock</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </h2>
        </div>

      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Total Price</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Order Date</th>
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