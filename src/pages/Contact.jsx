import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

export function ContactPage() {
  return (
    <div className="flex flex-col">
      
      <Header />

      <div className="flex-1 max-w-7xl mx-auto">
        <section className="px-4 py-12 space-y-12">

          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Liên Hệ Với Chúng Tôi</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="space-y-4 text-gray-700">
              <p><strong>Địa chỉ:</strong> 123 Sweet St, Hà Nội, Việt Nam</p>
              <p><strong>Điện thoại:</strong> (+84) 123 456 789</p>
              <p><strong>Email:</strong> contact@sweetcake.vn</p>
              <p><strong>Toạ độ:</strong> 21.0285, 105.8542</p>
            </div>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Tên của bạn"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="email"
                placeholder="Email của bạn"
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <textarea
                placeholder="Tin nhắn"
                className="w-full border border-gray-300 px-4 py-2 rounded min-h-[100px]"
              />
              <button
                type="submit"
                className="bg-pink-600 text-white px-6 py-2 rounded hover:bg-pink-700 transition"
              >
                Gửi tin nhắn
              </button>
            </form>

          </div>

        </section>
      </div>

      <Footer />

    </div>
  )
}
