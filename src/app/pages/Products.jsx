import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { Filter, X } from "lucide-react";
import { useProducts } from "../contexts/ProductContext";

export function Products() {
  const { products, categories, loading } = useProducts();

  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);

  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";

  // 1. STATE CHÍNH: Lưu khoảng giá đang được áp dụng để lọc
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  // 2. STATE TẠM: Lưu giá trị người dùng đang gõ vào ô input
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");

  const [sortBy, setSortBy] = useState("");

  // 3. HÀM ÁP DỤNG GIÁ
  const handleApplyPrice = () => {
    const min = minPriceInput ? Number(minPriceInput) : 0;
    const max = maxPriceInput ? Number(maxPriceInput) : 10000000;
    setPriceRange([min, max]);
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    // Price Range
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    if (sortBy === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, searchQuery, categoryFilter, priceRange, sortBy]);

  const handleCategoryChange = (category) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl font-semibold text-gray-500">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sản phẩm</h1>
            <p className="text-gray-600">
              Tìm thấy {filteredProducts.length} sản phẩm
              {searchQuery && ` cho "${searchQuery}"`}
              {categoryFilter && ` trong ${categoryFilter}`}
              {priceRange[0] > 0 && ` (từ ${priceRange[0].toLocaleString()}đ)`}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg"
          >
            <Filter className="w-5 h-5" />
            Bộ lọc
          </button>
        </div>

        <div className="flex gap-6">

          {/* Sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-64 bg-white p-6 rounded-lg shadow-sm h-fit">

              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-lg">Bộ lọc</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Danh mục</h3>
                <label key="all-category" className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={!categoryFilter}
                    onChange={() => handleCategoryChange("")}
                  />
                  <span>Tất cả</span>
                </label>


                       {categories.map((cat) => (
                 <label
                           key={cat.id}
                          className="flex items-center gap-2 cursor-pointer mt-2"
                       >
                      <input
                         type="radio"
                        name="category"
                       checked={categoryFilter === cat.name}
                             onChange={() => handleCategoryChange(cat.name)}
                           />
                    <span>{cat.name}</span>
                            </label>
                        ))}
              </div>

              {/* Price Filter*/}
              <div className="mb-6 border-t pt-4">
                <h3 className="font-medium mb-3">Khoảng giá</h3>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="From"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-2 py-1.5 border text-sm rounded focus:outline-none focus:border-black"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="To"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-2 py-1.5 border text-sm rounded focus:outline-none focus:border-black"
                  />
                </div>
                <button
                  onClick={handleApplyPrice}
                  className="w-full mt-3 bg-black text-white py-2 text-sm rounded hover:bg-gray-800 transition-colors"
                >
                  Áp dụng
                </button>
              </div>

              {/* Sort */}
              <div className="border-t pt-4">
                <h3 className="font-medium mb-3">Sắp xếp</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black"
                >
                  <option value="">Mặc định</option>
                  <option value="name">Tên A-Z</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="rating">Đánh giá cao nhất</option>
                </select>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}   // ✅ FIX KEY CHUẨN 100%
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">
                  Không tìm thấy sản phẩm nào phù hợp với mức giá này.
                </p>
                <button
                  onClick={() => {
                    setMinPriceInput("");
                    setMaxPriceInput("");
                    setPriceRange([0, 10000000]);
                  }}
                  className="mt-4 text-blue-500 underline"
                >
                  Xóa bộ lọc giá
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}