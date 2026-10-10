import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, UserCircle, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NAV_LINKS = [
  { to: "/shop/home", label: "Home" },
  { to: "/shop/listing", label: "Products" },
  { to: "/shop/about-us", label: "About Us" },
  { to: "/shop/contact-us", label: "Contact" },
];

function ShoppingHeader({ onOpenCart }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    toast.loading("Logging out...", { id: "logout" });
    dispatch(logoutUser()).then(() => {
      toast.success("Logged out successfully", { id: "logout" });
      navigate("/auth/login");
    });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button
          onClick={() => setMobileNavOpen((v) => !v)}
          className="text-ink md:hidden"
          aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/shop/home" className="font-display text-2xl italic tracking-tight text-ink">
          E-Kart
        </Link>

        <nav className="hidden gap-8 text-xs font-medium uppercase tracking-wider text-ink/70 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative py-1 transition hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-wine after:transition-all hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onOpenCart} className="relative text-ink" aria-label="Open cart">
            <ShoppingCart size={20} />
            {cartItems?.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-wine text-[10px] text-ivory">
                {cartItems.length}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 text-sm text-wine"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Link>
              )}
              <Link to="/shop/account" className="flex items-center gap-1 text-sm text-ink">
                <UserCircle size={20} />
                {user?.userName}
              </Link>
              <Button variant="ghost" onClick={handleLogout} className="!px-2" title="Logout">
                <LogOut size={18} />
                <span className="ml-1 hidden text-sm sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Link to="/auth/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <nav className="flex flex-col gap-1 border-t border-ink/10 bg-ivory px-4 py-3 text-sm font-medium uppercase tracking-wider text-ink/70 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileNavOpen(false)}
              className="rounded-md px-2 py-2 transition hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export default ShoppingHeader;