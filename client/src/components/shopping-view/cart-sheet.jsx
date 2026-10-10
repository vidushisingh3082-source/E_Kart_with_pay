import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { updateCartQuantity, deleteCartItem } from "@/store/shop/cart-slice";
import { Button } from "@/components/ui/button";

function CartSheet({ open, onOpenChange }) {
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = cartItems.reduce((sum, item) => {
    const price = item.productId?.salePrice > 0 ? item.productId.salePrice : item.productId?.price || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm transform flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="font-display text-lg text-ink">Your Cart ({cartItems.length})</h2>
          <button onClick={() => onOpenChange(false)} aria-label="Close cart">
            <X size={20} className="text-ink" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center text-ink/50">
              <ShoppingBag size={36} className="mb-3" />
              <p className="text-sm">Your cart is empty.</p>
            </div>
          )}
          {cartItems.map((item) => (
            <div key={`${item.productId?._id}-${item.size}`} className="flex gap-3">
              <img
                src={item.productId?.image}
                alt={item.productId?.title}
                className="h-20 w-16 rounded object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{item.productId?.title}</p>
                <p className="mt-0.5 text-xs uppercase tracking-wider text-ink/50">
                  Size: {item.size}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  ₹
                  {(item.productId?.salePrice > 0
                    ? item.productId.salePrice
                    : item.productId?.price || 0
                  ).toFixed(2)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartQuantity({
                          userId: user.id,
                          productId: item.productId._id,
                          size: item.size,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      )
                    }
                    className="rounded border border-ink/20 p-1"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm">{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateCartQuantity({
                          userId: user.id,
                          productId: item.productId._id,
                          size: item.size,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                    className="rounded border border-ink/20 p-1"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() =>
                      dispatch(
                        deleteCartItem({
                          userId: user.id,
                          productId: item.productId._id,
                          size: item.size,
                        })
                      )
                    }
                    className="ml-auto text-wine"
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-ink/10 px-5 py-4">
          <div className="mb-3 flex justify-between font-display text-lg text-ink">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <Button
            className="w-full"
            disabled={cartItems.length === 0}
            onClick={() => {
              onOpenChange(false);
              navigate("/shop/checkout");
            }}
          >
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}

export default CartSheet;
