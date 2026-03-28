import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div>

      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-6 shadow-sm">

        <h2 className="text-lg font-medium mb-4">Quick actions</h2>

        <Link
          to="/app/reservations/new"
          className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:opacity-90 transition"
        >
          ➕ New reservation
        </Link>

      </div>

    </div>
  );
}