
export function Mailing() {
  return(
    <section className="flex justify-center bg-orange-100/50 text-stone-800">
      <div className="max-w-4xl lg:my-10 mx-auto text-center lg:rounded-3xl bg-white p-10 shadow-xl border border-amber-200">

        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-amber-900 mb-4">
            Đăng Ký Nhận Khuyến Mãi
          </h2>

          <p className="mb-8 text-lg text-stone-600">
            Đừng bỏ lỡ những chiếc bánh mới nhất cùng các ưu đãi hấp dẫn chỉ dành riêng cho khách hàng đăng ký nhận tin. 
            Bạn sẽ nhận ngay <span className="font-semibold text-amber-700">voucher giảm 10%</span> cho đơn đầu tiên!
          </p>

          <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <input
              type="email"
              required
              placeholder="Email của bạn"
              className="px-5 py-3 w-full sm:w-2/3 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 transition text-stone-700 placeholder-stone-400"
            />
            <button
              type="submit"
              className="bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition font-medium shadow-md hover:shadow-lg cursor-pointer"
            >
              Đăng ký
            </button>
          </form>
          
          <p className="mt-6 text-sm text-stone-500 italic">
            Chúng tôi cam kết bảo mật thông tin và không chia sẻ với bên thứ ba.
          </p>
        </div>

      </div>
    </section>
  )
}