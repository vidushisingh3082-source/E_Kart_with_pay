import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ShoppingHeader from "@/components/shopping-view/header";
import CartSheet from "@/components/shopping-view/cart-sheet";
import Footer from "@/components/shopping-view/footer";
import { fetchCartItems } from "@/store/shop/cart-slice";

function ShoppingLayout() {
  const [showCart, setShowCart] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  function openCart() {
    setShowCart(true);
    if (user?.id) dispatch(fetchCartItems(user.id));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <ShoppingHeader onOpenCart={openCart} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      {/* Rendered here (outside the blurred header) so it always covers the full viewport */}
      <CartSheet open={showCart} onOpenChange={setShowCart} />
    </div>
  );
}

export default ShoppingLayout;
