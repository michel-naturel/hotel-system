import { Link } from "react-router-dom";
import GuestTopbar from "../components/GuestTopbar";

export default function PublicSuccess() {
  return (
    <div className="min-h-screen bg-bg p-10">
      <div className="max-w-4xl mx-auto">
        <GuestTopbar />
      </div>

      <div className="flex items-center justify-center">

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-10 text-center">

        <h1 className="text-3xl font-semibold mb-4">
          ✅ Rezerwacja zakończona
        </h1>

        <p className="text-muted mb-6">
          Dziękujemy za rezerwację!
        </p>

        <Link
          to="/"
          className="px-6 py-2 rounded-xl bg-primary text-white"
        >
          Powrót do strony głównej
        </Link>

      </div>
      </div>
    </div>
  );
}