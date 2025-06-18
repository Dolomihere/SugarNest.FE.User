import { useState, useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

import ProductService from '../services/ProductService'
import ProductOptionService from '../services/ProductOption'

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setSelectedOptions(prev => {
      const group = prev[name] || [];
      return {
        ...prev,
        [name]: checked
          ? [...group, value]
          : group.filter(v => v !== value)
      };
    });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setSelectedOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddToCart = () => {
    const userLoggedIn = !!localStorage.getItem('accessToken');

    const optionEntries = Object.entries(selectedOptions).flatMap(([groupId, values]) => {
      if (Array.isArray(values)) {
        return values.map(v => ({ optionGroupId: groupId, optionItemId: v }));
      } else {
        return [{ optionGroupId: groupId, optionItemId: values }];
      }
    });

    const item = {
      productId: id,
      note: null,
      quantity,
      productItemOptionModels: optionEntries,
    };

    if (userLoggedIn) {
      CartService.addItemToCart(item)
        .then(() => alert("Đã thêm vào giỏ hàng!"))
        .catch(() => alert("Có lỗi xảy ra"));
    } else {
      const cart = JSON.parse(localStorage.getItem('local_cart') || '[]');
      cart.push(item);
      localStorage.setItem('local_cart', JSON.stringify(cart));
      alert("Đã thêm vào giỏ hàng (local)!");
    }
  };

  const { data: product = {}, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => ProductService.getProductById(id).then(res => res.data.data),
  });

  const { data: products = [] } = useQuery({
    queryKey: ['suggested'],
    queryFn: () => ProductService.getAllProducts().then(res => res.data.data),
  });

  const { data: optionGroups = [] } = useQuery({
    queryKey: ['options', id],
    queryFn: () => ProductOptionService.getOptionOfProductById(id).then(res => res.data.data),
  });

  const suggestions = useMemo(() => {
    const otherProducts = products.filter(p => p.productId !== id);
    const shuffled = [...otherProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [products, id]);

  useEffect(() => {
    setQuantity(1);
    setCopied(false);
  }, [id]);

  return(
    <div className="min-h-dvh flex flex-col">

      <Header />

      <div className="flex-1 max-w-7xl md:min-w-7xl mx-auto px-4 py-12 space-y-16">
        <div className="flex flex-col md:flex-row gap-8">

          <div className="flex-1">
            <img
              src={product.imgs}
              alt={product.name}
              className="w-full h-[400px] object-cover rounded shadow"
            />
          </div>

          <div className="flex-1 space-y-4">

            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>

            <p className="text-xl text-pink-600 font-semibold">${product.unitPrice}</p>

            <div className="text-sm text-gray-500">Category ID: {product.categoryId}</div>

            {optionGroups.map(group => (
              <div key={group.optionGroupId} className="mb-6">
                <p className="font-semibold text-gray-800 mb-1">{group.name}</p>
                <p className="text-sm text-gray-500 mb-3">{group.description}</p>

                <div className="space-y-2">
                  {group.isMultipleChoice ? (
                    group.optionItems.map(item => (
                      <label key={item.optionItemId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name={group.optionGroupId}
                          value={item.optionItemId}
                          onChange={handleCheckboxChange}
                        />
                        <span>{item.optionValue} (+${item.additionalPrice})</span>
                      </label>
                    ))
                  ) : (
                    group.optionItems.map(item => (
                      <label key={item.optionItemId} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={group.optionGroupId}
                          value={item.optionItemId}
                          onChange={handleRadioChange}
                        />
                        <span>{item.optionValue} (+${item.additionalPrice})</span>
                      </label>
                    ))
                  )}
                </div>
              </div>
            ))}

            <div className="flex items-center gap-4 mt-4">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 border rounded cursor-pointer">-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border rounded cursor-pointer">+</button>
            </div>

            <div className="flex items-center gap-4 mt-6">

              <button 
                onClick={() => {handleAddToCart(); setQuantity(1)}}
                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 cursor-pointer">
                Thêm vào giỏ
              </button>

              <div className="relative">
                <button className="text-gray-600 text-xl hover:text-red-500 cursor-pointer">❤️</button>
              </div>

              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="text-gray-600 hover:text-blue-500 cursor-pointer"
                >
                  🔗
                </button>

                {copied && (
                  <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow">
                    Đã sao chép!
                  </div>
                )}

              </div>
              
            </div>

          </div>
        </div>

        <div>

          <h3 className="text-2xl font-bold mb-6">Sản phẩm gợi ý</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {suggestions.map(p => (
              <div key={p.productId} className="border rounded overflow-hidden hover:shadow">

                <Link to={`/products/${p.productId}`}>
                  <img src={p.imgs} alt={p.name} className="w-full h-40 object-cover" />
                </Link>

                <div className="p-4 text-center">
                  <h4 className="font-semibold text-gray-800">{p.name}</h4>
                  <p className="text-pink-600 mt-1">${p.unitPrice}</p>
                </div>

              </div>
            ))}

          </div>
    
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded hover:bg-pink-700 transition"
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
