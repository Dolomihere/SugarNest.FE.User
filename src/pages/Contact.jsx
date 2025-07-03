// Contact.jsx
import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'
import { motion } from 'framer-motion'

export function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Xử lý dữ liệu
  }

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto] font-sans bg-[#FFF9F4] text-gray-800">
      <Header />

      <main className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-12 pb-24 space-y-14">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.5 }}
          className="relative text-center text-4xl font-extrabold text-amber-600 uppercase tracking-wide"
        >
          <span className="relative z-10 bg-[#FFF9F4] px-4">Liên hệ với chúng tôi</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full border-t border-amber-300 absolute top-1/2"></div>
          </div>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <img
              src="https://i.pinimg.com/736x/94/69/1f/94691f308486d9f0dff0c5a485f24301.jpg"
              alt="Liên hệ"
              className="w-full h-[550px] object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-semibold mb-2">Bạn cần hỗ trợ?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Hãy điền thông tin vào biểu mẫu dưới đây. Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tên đầy đủ"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Địa chỉ email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>
              <textarea
                placeholder="Nội dung bạn muốn trao đổi..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none min-h-[120px] focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              ></textarea>
              <button
                type="submit"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition duration-300 w-full sm:w-auto"
              >
                Gửi Liên Hệ
              </button>

              <div className="flex justify-center gap-6 mt-8">
                {[faFacebookF, faInstagram, faTiktok].map((icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="text-gray-400 hover:text-amber-600 transition duration-200"
                  >
                    <FontAwesomeIcon icon={icon} size="lg" />
                  </a>
                ))}
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
