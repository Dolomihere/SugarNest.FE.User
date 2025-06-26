
export function CustomCard () {
  return (
    <div className="antialiased text-gray-900 cursor-pointer">
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl group transition-transform duration-300 hover:translate-y-[-10px]">

        <div className="w-full h-32 overflow-hidden">
          <img
            className="h-full w-full object-cover transform overflow-hidden transition-transform duration-[300ms] hover:scale-115 object-end"
            src="https://images.pexels.com/photos/2144200/pexels-photo-2144200.jpeg?_gl=1*mflc37*_ga*MTczMDkyMTYwNi4xNzQ1MTQxMTU4*_ga_8JE65Q40S6*czE3NTAxNjExNjgkbzYkZzEkdDE3NTAxNjExODYkajQyJGwwJGgw"
            alt="SugarNest bakery"
          />
        </div>

        <div className="p-6 pb-4 group-hover:bg-gray-100 duration-[0.3s]">

          <div className="mt-1 group-hover:text-gray-800">
            <span className="text-2xl font-semibold group-hover:text-inherit">
              8.99đ
            </span>
          </div>

          <h4 className="mt-1 font-bold text-xl leading-tight truncate text-amber-600 shadow-gray-300 duration-[0.3s]">
            Delightful Strawberry Cheesecake
          </h4>

          <p className="mt-2 text-gray-500 Card-info ">
            A rich and creamy cheesecake topped with fresh strawberries and a
            delicate glaze. Perfectly balanced sweetness in every bite!
          </p>

          <div className="flex items-center mt-4">
            <img
              className="w-10 h-10 rounded-full"
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&auto=format&fit=facearea&w=256&q=80"
              alt="Daniela Metz"
            />

            <div className="ml-3">

              <p className="text-sm font-medium text-gray-900">
                <a
                  href="#"
                  className="font-black  hover:underline duration-[0.3s]"
                >
                  Handsome administrator
                </a>
              </p>

              <div className="flex space-x-1 text-sm text-gray-500  duration-[0.3s]">
                <time dateTime="2020-02-12">Feb 12, 2020</time>
                <span aria-hidden="true">·</span>
              </div>

            </div>

          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-amber-500">★★★★☆</span>

            <div className="flex items-center text-gray-600 ">
              <span className="text-sm text-inherit group-hover:text-inherit">
                34 reviews
              </span>
              <span className="flex items-center ml-4 text-sm text-inherit group-hover:text-inherit">
                3440
              </span>
            </div>
          </div>

        </div>
        
      </div>
    </div>
  )
}
