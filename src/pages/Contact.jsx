import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

export function ContactPage() {
  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-section text-main">
      
      <Header />

      <div className="max-w-7xl mx-auto w-full">
        <section className="px-4 md:px-8 py-16 space-y-12">

          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-main mb-8">
            Liên Hệ Với Chúng Tôi
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Thông tin liên hệ */}
            <div className="space-y-5 text-sub text-lg">
              <p><strong>Địa chỉ:</strong> 123 Sweet St, Hà Nội, Việt Nam</p>
              <p><strong>Điện thoại:</strong> (+84) 123 456 789</p>
              <p><strong>Email:</strong> contact@sweetcake.vn</p>
              <p><strong>Tọa độ:</strong> 21.0285, 105.8542</p>
            </div>

            {/* Form liên hệ */}
            <form className="space-y-4 text-sub text-base">
              <input
                id="name"
                type="text"
                placeholder="Tên của bạn"
                className="w-full border border-orange-200 px-4 py-3 rounded-lg bg-white placeholder:text-sub"
              />
              <input
                id="email"
                type="email"
                placeholder="Email của bạn"
                className="w-full border border-orange-200 px-4 py-3 rounded-lg bg-white placeholder:text-sub"
              />
              <textarea
                name="message"
                placeholder="Tin nhắn"
                className="w-full border border-orange-200 px-4 py-3 rounded-lg bg-white min-h-[120px] resize-none placeholder:text-sub"
              />
              <button
                type="submit"
                className="btn-primary shadow-md hover:shadow-lg transition"
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
