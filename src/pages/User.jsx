import { useState } from 'react'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'

export function UserPage() {
  const [mode, setMode] = useState(1);
  const links = [
    { label: "Giỏ hàng" },
    { label: "Hóa đơn" },
    { label: "Đơn hàng" },
    { label: "Tài khoản"},
  ];

  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto]">

      <Header />

      <main className="grid grid-cols-[15%_1fr] overflow-hidden">
        <nav className="bg-white border-r">

          <ul className="p-4 space-y-4 text-center">

            {links.map((option, i) => (
              <li 
                key={i}
                onClick={() => setMode(i)}
                className="cursor-pointer hover:bg-amber-200 pt-2 rounded-md"
              >{option.label}</li>
            ))}

          </ul>
          
        </nav>
        
      </main>

      <Footer />
      
    </div>
  )
}
