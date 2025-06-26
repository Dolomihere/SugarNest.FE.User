import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import ProductService from '../services/ProductService'
import ProductOptionService from '../services/ProductOption'
import CartService from '../services/CartService'

export function ProductDetailPage() {
  const { id } = useParams()
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)

  const token = localStorage.getItem('accessToken');
  const isLoggedIn = !!token;

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target
    setSelectedOptions((prev) => {
      const group = prev[name] || []
      return {
        ...prev,
        [name]: checked ? [...group, value] : group.filter((v) => v !== value),
      }
    })
  }

  const handleRadioChange = (e) => {
    const { name, value } = e.target
    setSelectedOptions((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddToCart = async () => {
    const optionEntries = Object.entries(selectedOptions).flatMap(([groupId, values]) => {
      if (Array.isArray(values)) {
        return values.map((v) => ({ optionGroupId: groupId, optionItemId: v }))
      } else {
        return [{ optionGroupId: groupId, optionItemId: values }]
      }
    })

    const item = {
      productId: id,
      note: null,
      quantity,
      productItemOptionModels: optionEntries,
    }

    const token = localStorage.getItem('accessToken')
    const isLoggedIn = !!token

    try {
      if (isLoggedIn) {
        await CartService.addItemToCart(item, token);
        alert('Đã thêm vào giỏ hàng (đăng nhập)!')
      } else {
        const cart = JSON.parse(localStorage.getItem('local_cart') || '[]')
        cart.push(item)
        localStorage.setItem('local_cart', JSON.stringify(cart))
        alert('Đã thêm vào giỏ hàng (khách)!')
      }
    } catch (error) {
      console.error('Add to cart failed:', error)
      alert('Lỗi khi thêm vào giỏ hàng.')
    }
  }

  const { data: product = {} } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getProductById(id).then((res) => res.data.data),
  })

  const { data: products = [] } = useQuery({
    queryKey: ['suggested'],
    queryFn: () => ProductService.getAllProducts().then((res) => res.data.data),
  })

  const { data: optionGroups = [] } = useQuery({
    queryKey: ['options', id],
    queryFn: () => ProductOptionService.getOptionOfProductById(id).then((res) => res.data.data),
  })

  const suggestions = useMemo(() => {
    const otherProducts = products.filter((p) => p.productId !== id)
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 4)
  }, [products, id])

  useEffect(() => {
    setQuantity(1)
    setCopied(false)
  }, [id])

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans text-gray-600 bg-[#fffaf3]">

      <Header />

      <div className="px-4 my-12 mx-auto space-y-16 max-w-7xl">
        <div className="flex flex-col gap-10 p-6 bg-white rounded-lg shadow-md md:flex-row md:gap-16">

          <div className="flex-1">
            <img
              src={product.imgs}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded-lg shadow-sm"
            />
          </div>

          <div className="flex-1 space-y-6">
            <h2 className="text-4xl font-bold text-gray-600">{product.name}</h2>
            <p className="leading-relaxed text-gray-600">{product.description}</p>
            <p className="text-2xl font-semibold text-yellow-600">${product.unitPrice}</p>
            <div className="text-sm text-gray-500">Mã danh mục: {product.categoryId}</div>

            {optionGroups.map((group) => (
              <div key={group.optionGroupId}>
                <p className="font-semibold text-gray-600">{group.name}</p>
                <p className="mb-2 text-sm text-gray-500">{group.description}</p>

                <div className="space-y-2">

                  {group.isMultipleChoice
                    ? group.optionItems.map((item) => (
                        <label key={item.optionItemId} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            name={group.optionGroupId}
                            value={item.optionItemId}
                            onChange={handleCheckboxChange}
                            className="accent-yellow-600"
                          />
                          <span>
                            {item.optionValue}{' '}
                            <span className="text-gray-400">(+${item.additionalPrice})</span>
                          </span>
                        </label>
                      ))
                    : group.optionItems.map((item) => (
                        <label key={item.optionItemId} className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name={group.optionGroupId}
                            value={item.optionItemId}
                            onChange={handleRadioChange}
                            className="accent-yellow-600"
                          />
                          <span>
                            {item.optionValue}{' '}
                            <span className="text-gray-400">(+${item.additionalPrice})</span>
                          </span>
                        </label>
                      ))}

                </div>
              </div>
            ))}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 text-lg font-bold text-gray-700 border rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="text-lg font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 text-lg font-bold text-gray-700 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => {
                  handleAddToCart()
                  setQuantity(1)
                }}
                className="px-6 py-2 text-white transition bg-yellow-600 rounded hover:bg-yellow-700"
              >
                Thêm vào giỏ
              </button>

              <button className="text-xl text-yellow-500 transition hover:text-yellow-600">
                <i className="fa-solid fa-heart"></i>
              </button>

              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="text-gray-600 transition hover:text-blue-500"
                  title="Sao chép liên kết"
                >
                  <i className="fa-solid fa-copy"></i>
                </button>

                {copied && (
                  <div className="absolute px-2 py-1 text-xs text-white transform -translate-x-1/2 bg-black rounded shadow -top-6 left-1/2">
                    Đã sao chép!
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <h3 className="text-2xl font-bold text-gray-600">Sản phẩm gợi ý</h3>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {suggestions.map((p) => (
              <div
                key={p.productId}
                className="overflow-hidden transition bg-white border rounded-lg shadow-sm hover:shadow-md"
              >
                <Link to={`/products/${p.productId}`}>
                  <img src={p.imgs} alt={p.name} className="object-cover w-full h-40" />
                </Link>
                <div className="p-4 text-center">
                  <h4 className="text-lg font-semibold text-gray-800">{p.name}</h4>
                  <p className="mt-1 text-yellow-600">${p.unitPrice}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/products"
              className="inline-block px-6 py-3 text-white transition bg-yellow-600 rounded hover:bg-yellow-700"
            >
              Xem thêm sản phẩm
            </Link>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}
