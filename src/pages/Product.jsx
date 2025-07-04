import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'
import { ProductCard } from '../components/ProductCard'

import CategoryService from '../services/CategoryService'
import ProductService from '../services/ProductService'

import pagination from '../utils/Pagination'
import { ProductFilter } from '../utils/ProductUtil'

export function ProductPage() {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategory] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories().then(res => res.data.data),
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
  });

  let filteredProducts = ProductFilter(products, search, selectedCategoryId, priceRange);
  let totalPerIndex = 8;
  let totalPages = pagination.totalPage(filteredProducts, totalPerIndex);
  let paginatedProducts = pagination.dataPerPage(filteredProducts, currentPageIndex, totalPerIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPageIndex(page);
  };

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] text-gray-700 bg-[#fffaf3]">
      <Header />

      <main className="flex flex-col gap-5 px-4 mx-auto my-12 max-w-7xl md:min-w-7xl">

        <div className="text-center">
          <h2 className="mb-6 text-3xl font-bold text-amber-600">Sản Phẩm Của Chúng Tôi</h2>
          <p className="text-sub">Khám phá các loại bánh thơm ngon, được làm thủ công mỗi ngày</p>
        </div>

        <div className="flex flex-col justify-between gap-4 mt-8 md:flex-row">

          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc mô tả sản phẩm..."
            className="flex-1 px-4 py-2 placeholder-gray-400 border border-gray-300 rounded-md focus:outline-none focus:border-amber-600"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPageIndex(1);
            }}
          />

          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPageIndex(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-amber-600"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-sub">Giá:</span>
            <input
              type="number"
              placeholder="Từ"
              className="w-20 px-2 py-1 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:border-amber-600"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <input
              type="number"
              placeholder="Đến"
              className="w-20 px-2 py-1 placeholder-gray-400 border border-gray-300 rounded focus:outline-none focus:border-amber-600"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 mt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => handlePageChange(currentPageIndex - 1)}
            disabled={currentPageIndex === 1}
            className="px-4 py-2 transition border rounded cursor-pointer text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white disabled:opacity-50"
          >
            ← Trước
          </button>

          <span className="text-sm text-amber-600">
            Trang {currentPageIndex} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPageIndex + 1)}
            disabled={currentPageIndex === totalPages}
            className="px-4 py-2 transition border rounded cursor-pointer text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white disabled:opacity-50"
          >
            Tiếp →
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}
