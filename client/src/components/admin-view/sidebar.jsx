import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, Image, X } from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ClipboardList },
  { to: "/admin/features", label: "Features", icon: Image },
];

function SidebarNav({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
              isActive ? "bg-ink text-ivory" : "text-ink/70 hover:bg-ink/5"
            }`
          }
        >
          <Icon size={16} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function AdminSidebar({ mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r border-ink/10 bg-white p-4 md:block">
        <h2 className="mb-6 font-display text-lg italic text-ink">Admin Panel</h2>
        <SidebarNav />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-ink/40" onClick={onClose} />
          <aside className="fixed left-0 top-0 h-full w-64 max-w-[80%] overflow-y-auto bg-white p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-display text-lg italic text-ink">Admin Panel</h2>
              <button onClick={onClose} aria-label="Close menu">
                <X size={20} className="text-ink" />
              </button>
            </div>
            <SidebarNav onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  );
}

export default AdminSidebar;
