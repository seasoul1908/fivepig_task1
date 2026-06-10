import { useProducts } from '../../contexts/ProductContext';
import { useOrders } from '../../contexts/OrderContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminReports() {
  const { products, categories } = useProducts();
  const { orders } = useOrders();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Revenue by status
  const revenueByStatus = [
    {
      name: 'Đã giao',
      value: orders
  .filter((o) => o.status === "Shipped")
  .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    },
    {
      name: 'Đang giao',
      value: orders
  .filter((o) => o.status === "Delivery")
  .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    },
    {
      name: 'Đã xác nhận',
      value: orders
  .filter((o) => o.status === "Confirmed")
  .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    },
    {
      name: 'Chờ xử lý',
      value: orders
  .filter((o) => o.status === "Pending")
  .reduce((sum, o) => sum + (o.totalPrice || 0), 0),
    }
  ];

  // Products by category
const productsByCategory = categories.map((cat) => ({
  name: cat.name,
  count: products.filter((p) => p.category === cat.name).length,
}));

 // Top selling products (mock)
const topProducts = products
  .map((p) => ({
    name: p.name,
    sold: (Number(p.stockSold) || 0) || Math.floor((Number(p.rating) || 3) * 50),
  }))
  .sort((a, b) => b.sold - a.sold)
  .slice(0, 5);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const totalRevenue = orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Báo cáo & Thống kê</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-2">Tổng doanh thu</h3>
          <p className="text-3xl font-bold text-blue-600">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-2">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-green-600">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-gray-600 text-sm mb-2">Giá trị TB/Đơn hàng</h3>
          <p className="text-3xl font-bold text-purple-600">{formatPrice(avgOrderValue)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue by Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Doanh thu theo trạng thái</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatPrice(Number(value))} />
              <Legend />
              <Bar dataKey="value" fill="#3B82F6" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products by Category */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Sản phẩm theo danh mục</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productsByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, count }) => `${name}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {productsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4">Sản phẩm bán chạy</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sold" fill="#10B981" name="Đã bán" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'Pending').length}
            </p>
            <p className="text-sm text-gray-600">Chờ xử lý</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'Confirmed').length}
            </p>
            <p className="text-sm text-gray-600">Đã xác nhận</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {orders.filter(o => o.status === 'Shipped').length}
            </p>
            <p className="text-sm text-gray-600">Đang giao</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'Delivered').length}
            </p>
            <p className="text-sm text-gray-600">Đã giao</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {orders.filter(o => o.status === 'Cancelled').length}
            </p>
            <p className="text-sm text-gray-600">Đã hủy</p>
          </div>
        </div>
      </div>
    </div>
  );
}