
export function Order() {
  return(
    <div class="overflow-y-auto bg-orange-50/30 text-[#5C3A21]">
      <div class="bg-white/70 border border-orange-100 rounded-xl shadow-md hover:shadow-lg transition p-6">

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <p class="text-stone-700 font-semibold">Mã đơn hàng: <span class="text-[#C06014]">#SN123456</span></p>
            <p class="text-sm text-stone-600">Ngày đặt: 12/06/2025</p>
            <p class="text-sm text-stone-600">Tổng tiền: <span class="font-medium text-amber-600">$45.80</span></p>
          </div>

          <div class="text-sm md:text-base">
            <span class="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">Đang giao</span>
          </div>

        </div>

        <div class="mt-4 divide-y divide-orange-100">

          <div class="flex items-center py-3 gap-4">
            <img class="w-20 h-20 object-cover rounded-lg border border-orange-100" src="https://res.cloudinary.com/dwlvd5lxt/image/upload/v1749870479/sugarnest/products/8e917726-f489-4ed7-9e0d-25f83d6a8654" alt="Tiramisu Slice" />
            <div class="flex-1">
              <h3 class="font-semibold text-[#5C3A21]">Tiramisu Slice</h3>
              <p class="text-sm text-stone-600">Số lượng: 2</p>
            </div>
            <div class="text-right text-[#C06014] font-medium">$12.00</div>
          </div>

          <div class="flex items-center py-3 gap-4">
            <img class="w-20 h-20 object-cover rounded-lg border border-orange-100" src="https://res.cloudinary.com/dwlvd5lxt/image/upload/v1749870479/sugarnest/products/2c08fc57-46f6-4083-8f6f-2642bc065d95" alt="Mango Cheesecake" />
            <div class="flex-1">
              <h3 class="font-semibold text-[#5C3A21]">Mango Cheesecake</h3>
              <p class="text-sm text-stone-600">Số lượng: 1</p>
            </div>
            <div class="text-right text-[#C06014] font-medium">$21.80</div>
          </div>

          <div class="flex items-center py-3 gap-4">
            <img class="w-20 h-20 object-cover rounded-lg border border-orange-100" src="https://res.cloudinary.com/dwlvd5lxt/image/upload/v1749870479/sugarnest/products/8e917726-f489-4ed7-9e0d-25f83d6a8654" alt="Tiramisu Slice" />
            <div class="flex-1">
              <h3 class="font-semibold text-[#5C3A21]">Tiramisu Slice</h3>
              <p class="text-sm text-stone-600">Số lượng: 2</p>
            </div>
            <div class="text-right text-[#C06014] font-medium">$12.00</div>
          </div>

          <div class="flex items-center py-3 gap-4">
            <img class="w-20 h-20 object-cover rounded-lg border border-orange-100" src="https://res.cloudinary.com/dwlvd5lxt/image/upload/v1749870479/sugarnest/products/2c08fc57-46f6-4083-8f6f-2642bc065d95" alt="Mango Cheesecake" />
            <div class="flex-1">
              <h3 class="font-semibold text-[#5C3A21]">Mango Cheesecake</h3>
              <p class="text-sm text-stone-600">Số lượng: 1</p>
            </div>
            <div class="text-right text-[#C06014] font-medium">$21.80</div>
          </div>

        </div>
        
      </div>
    </div>
  )
}
