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
  const [priceRange, setPriceRange] = useState([0, 100]);
  
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => CategoryService.getAllCategories().then(res => res.data.data),
  });

  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
  });

  const filteredProducts = ProductFilter(products, search, selectedCategoryId, priceRange);

  let totalPerIndex = 8;
  const totalPages = pagination.totalPage(filteredProducts, totalPerIndex)
  const paginatedProducts = pagination.dataPerPage(filteredProducts, currentPageIndex, totalPerIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPageIndex(page);
  };

  return(
    <div className="min-h-dvh flex flex-col">

      <Header />

      <div className="flex-1 max-w-7xl md:min-w-7xl mx-auto px-4">

        <div className="text-center my-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Sản Phẩm Của Chúng Tôi</h2>
          <p>Khám phá các loại bánh thơm ngon, được làm thủ công mỗi ngày</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

          <input
            type="text"
            placeholder="Tìm kiếm tên hoặc mô tả sản phẩm..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
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
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Tất cả danh mục</option>

            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}

          </select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Giá:</span>
            <input
              type="number"
              placeholder="Từ"
              className="w-20 px-2 py-1 border border-gray-300 rounded"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            />
            <input
              type="number"
              placeholder="Đến"
              className="w-20 px-2 py-1 border border-gray-300 rounded"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
            />
          </div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {paginatedProducts.map((p) => (
            <ProductCard key={p.productId} product={p} />
          ))}

        </div>

        <div className="flex justify-center items-center gap-4 my-10">
          <button
            onClick={() => handlePageChange(currentPageIndex - 1)}
            disabled={currentPageIndex === 1}
            className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
          >
            ← Trước
          </button>

          <span className="text-sm text-gray-700">
            Trang {currentPageIndex} / {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPageIndex + 1)}
            disabled={currentPageIndex === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50 cursor-pointer"
          >
            Tiếp →
          </button>
        </div>

      </div>

      <Footer />
      
    </div>
  )
}
