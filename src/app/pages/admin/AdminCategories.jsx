import { useState } from 'react';

import { useProducts } from '../../contexts/ProductContext';

import { Plus, Trash2 } from 'lucide-react';

import { toast } from 'sonner';


export function AdminCategories() {
  const { categories, addCategory, deleteCategory, products } = useProducts();
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }
    addCategory(newCategory.trim());
    setNewCategory('');
    toast.success('Thêm danh mục thành công!');
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    const hasProducts = products.some(p => p.category === categoryName);
    if (hasProducts) {
      toast.error('Không thể xóa danh mục có sản phẩm');
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}" không?`)) {
      deleteCategory(categoryId);
      toast.success('Xóa danh mục thành công!');
    }
  };

  const getProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Quản lý danh mục</h1>

      {/* Add Category Form */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Thêm danh mục mới</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nhập tên danh mục..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Thêm
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Tên danh mục</th>
              <th className="text-left py-3 px-4">Số lượng sản phẩm</th>
              <th className="text-left py-3 px-4">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{category.name}</td>
                <td className="py-3 px-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {getProductCount(category.name)} sản phẩm
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    disabled={getProductCount(category.name) > 0}
                    className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    title={getProductCount(category.name) > 0 ? 'Không thể xóa danh mục có sản phẩm' : 'Xóa danh mục'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có danh mục nào
          </div>
        )}
      </div>
    </div>
  );
}