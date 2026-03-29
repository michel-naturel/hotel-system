import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
  { to: "/admin/hotels", label: "Zarządzaj hotelem" },
  //  { to: "/admin/calendar", label: "Kalendarz rezerwacji" }, 
  { to: "/admin/add-hotel", label: "Dodaj hotel" },
  { to: "/admin/add-room", label: "Dodaj pokój" },

];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-bg text-text">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white/70 backdrop-blur border-r border-secondary p-6">

        <h2 className="text-xl font-semibold mb-8">Admin</h2>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-secondary text-text font-medium"
                    : "text-muted hover:bg-secondary/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-secondary bg-white/60 backdrop-blur">
          <span className="text-sm text-muted">
            {user?.username || "Admin"} ({user?.role || "admin"})
          </span>

          <button
            onClick={handleLogout}
            className="px-3 py-1 rounded-lg bg-secondary hover:bg-primary/20 transition"
          >
            Logout
          </button>
        </div>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}