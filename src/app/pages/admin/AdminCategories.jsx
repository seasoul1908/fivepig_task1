import { useState } from 'react';

import { useProducts } from '../../contexts/ProductContext';

import { Plus, Trash2, Edit2 } from 'lucide-react';

import { toast } from 'sonner';


export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory, products } = useProducts();
  const [newCategory, setNewCategory] = useState('');
  
  // State cho Edit Modal
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // ===== ADD CATEGORY FUNCTION =====
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error('Please enter a category name');
      return;
    }
    addCategory(newCategory.trim());
    setNewCategory('');
    toast.success('Category added successfully!');
  };

  // ===== EDIT CATEGORY FUNCTION =====
  const handleEditClick = (category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const handleEditSave = async () => {
    if (!editingName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      await updateCategory(editingId, editingName.trim());
      toast.success('Category updated successfully!');
      setEditingId(null);
      setEditingName('');
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  // ===== DELETE CATEGORY FUNCTION =====
  const handleDeleteCategory = async (categoryId, categoryName) => {
    // Check if category has products
    const hasProducts = products.some(p => p.category === categoryName);
    if (hasProducts) {
      toast.error(`Cannot delete category "${categoryName}" because it still has products`);
      return;
    }

    // Confirm before deleting
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId);
        toast.success('Category deleted successfully!');
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
  };

  // ===== COUNT PRODUCTS FUNCTION =====
  const getProductCount = (categoryName) => {
    return products.filter(p => p.category === categoryName).length;
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Category Management</h1>

      {/* ===== ADD CATEGORY FORM ===== */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Enter category name..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            Add
          </button>
        </form>
      </div>

      {/* ===== CATEGORIES LIST ===== */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">Category Name</th>
              <th className="text-left py-3 px-4">Product Count</th>
              <th className="text-center py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id} className="border-b hover:bg-gray-50">
                {/* ===== NORMAL DISPLAY ===== */}
                {editingId !== category.id ? (
                  <>
                    <td className="py-3 px-4 font-medium">{category.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {getProductCount(category.name)} products
                      </span>
                    </td>
                    <td className="py-3 px-4 flex gap-2 items-center justify-center">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEditClick(category)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                        title="Edit category"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                ) : (
                  /* ===== EDIT MODE ===== */
                  <>
                    <td className="py-3 px-4 flex items-center">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        autoFocus
                        className="w-48 px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="New category name..."
                      />
                    </td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4 flex gap-3 justify-center items-center">
                      <button
                        onClick={handleEditSave}
                        className="min-w-20 px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition whitespace-nowrap"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="min-w-20 px-5 py-2 bg-gray-400 text-white text-sm font-medium rounded-md hover:bg-gray-500 transition whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>


        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No categories yet
          </div>
        )}
      </div>
    </div>
  );
}