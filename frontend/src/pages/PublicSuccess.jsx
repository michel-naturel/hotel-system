import { Link } from "react-router-dom";

export default function PublicSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">

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
  );
}