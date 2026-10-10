import { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Menu } from "lucide-react";
import AdminSidebar from "./sidebar";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/store/auth-slice";
import { toast } from "sonner";

function AdminLayout() {
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
    <div className="flex min-h-screen">
      <AdminSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-ink/10 bg-white px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="text-ink md:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="font-display italic text-ink">Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/shop/home" target="_blank" rel="noreferrer">
              <Button variant="outline">View Store</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;