import { Link } from 'react-router-dom'

export function ProductShowcase() {
  const categories = [
    { name: "Cakes", img: "/cat-cake.jpg" },
    { name: "Cookies", img: "/cat-cookie.jpg" },
    { name: "Bread", img: "/cat-bread.jpg" },
    { name: "Pastries", img: "/cat-pastry.jpg" },
  ];

  const hotProducts = [
    { name: "Strawberry Shortcake", price: "$18", img: "/hot1.jpg" },
    { name: "Chocolate Croissant", price: "$6", img: "/hot2.jpg" },
    { name: "Lemon Tart", price: "$9", img: "/hot3.jpg" },
    { name: "Red Velvet Cake", price: "$20", img: "/hot4.jpg" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 space-y-16">

      <div>

        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Danh Mục Sản Phẩm</h2>
          <p>Khám phá các loại bánh đa dạng của chúng tôi, được làm thủ công mỗi ngày với nguyên liệu tươi ngon nhất</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:gap-8 gap-6">

          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="rounded-lg overflow-hidden shadow hover:shadow-md transition"
            >

              <img src={cat.img} alt={cat.name} className="w-full h-40 object-cover" />
              <div className="p-4 text-center font-semibold text-gray-700">{cat.name}</div>

            </div>
          ))}

        </div>

      </div>

      <div>

        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Sản Phẩm Bán Chạy</h2>
          <p>Những sản phẩm được yêu thích nhất và được đặt hàng nhiều nhất từ khách hàng của chúng tôi</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {hotProducts.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg overflow-hidden border hover:shadow transition"
            >

              <img src={item.img} alt={item.name} className="w-full h-40 object-cover" />

              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-pink-600 font-medium mt-1">{item.price}</p>
              </div>

            </div>
          ))}

        </div>
      </div>

      <div className="flex justify-center">

        <Link
          to="/products"
          className="bg-pink-600 text-white px-8 py-3 text-lg rounded-lg hover:bg-pink-700 transition"
        >
          Xem tất cả các sản phẩm
        </Link>

      </div>
      
    </section>
  );
}
