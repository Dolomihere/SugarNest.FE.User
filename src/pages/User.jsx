import { useState } from 'react'
import { useAuthGuard } from '../utils/CheckAuth'

import { Header } from './layouts/Header'
import { Footer } from './layouts/Footer'
import { Cart } from './layouts/user/Cart'
import { Order } from './layouts/user/order'
import { UserNav } from './layouts/user/UserNav'

export function UserPage() {
  const [mode, setMode] = useState(0);
  const links = [
    { label: "Giỏ hàng" },
    { label: "Đơn hàng" },
    { label: "Tài khoản"},
  ];

  const { isAuthenticated, isLoading } = useAuthGuard();

  if (isLoading) return <div>Checking authentication...</div>;

  if (!isAuthenticated) return null;

  const switchMode = (num) => {
    switch (num) {
      case 0: return <Cart  />
      case 1: return <Order />
      default: 
        break;
    }
  }

  return (
    <div className="min-h-dvh grid grid-rows-[auto_1fr_auto]">

      <Header />

      <div className="grid grid-cols-[10%_1fr] overflow-hidden">
        <aside className="basis-[10%] flex-none flex flex-col">
          <UserNav links={links} setMode={setMode} />
          <p>{mode}</p>
        </aside>

        <main className="flex-1 flex flex-col">
          {switchMode(mode)}
        </main>
      </div>

      <Footer />
      
    </div>
  );
}
