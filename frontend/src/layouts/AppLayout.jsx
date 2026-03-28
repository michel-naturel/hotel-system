import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import HotelSelector from "../components/HotelSelector";

export default function AppLayout() {
  const [hotelId, setHotelId] = useState("h1");
  const location = useLocation();

  const navItems = [
    { to: "/app/dashboard", label: "Dashboard" },
    { to: "/app/calendar", label: "Kalendarz" },
    { to: "/app/rooms", label: "Pokoje" },
    { to: "/app/reservations", label: "Rezerwacje" },
  ];

  return (
    <div className="flex h-screen bg-bg text-text">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white/70 backdrop-blur border-r border-secondary p-6 flex flex-col">

        <h2 className="text-xl font-semibold mb-8">Recepcja</h2>

        <nav className="flex flex-col gap-2">

          <Link
            to="/app/reservations/new"
            className="mb-4 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition"
          >
            + Nowa rezerwacja
          </Link>

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

          <HotelSelector selected={hotelId} setSelected={setHotelId} />

          <div className="flex items-center gap-4 text-sm text-muted">
            <span>Recepcja</span>
            <button className="px-3 py-1 rounded-lg bg-secondary hover:bg-primary/20 transition">
              Logout
            </button>
          </div>

        </div>

        {/* CONTENT */}
        <main className="flex-1 p-8 overflow-auto">
          <Outlet context={{ hotelId }} />
        </main>

      </div>
    </div>
  );
}