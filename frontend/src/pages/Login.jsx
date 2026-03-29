import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [role, setRole] = useState("guest");
  const [username, setUsername] = useState("guest");
  const [password, setPassword] = useState("guest123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin/hotels" replace />;
  }
  if (isAuthenticated && user?.role === "staff") {
    return <Navigate to="/app/dashboard" replace />;
  }
  if (isAuthenticated && user?.role === "guest") {
    return <Navigate to="/" replace />;
  }

  const fillCredentials = (nextRole) => {
    setRole(nextRole);
    if (nextRole === "admin") {
      setUsername("admin");
      setPassword("admin123");
      return;
    }
    if (nextRole === "staff") {
      setUsername("staff");
      setPassword("staff123");
      return;
    }
    setUsername("guest");
    setPassword("guest123");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loggedUser = await login({ username, password, role });
      if (loggedUser.role === "admin") {
        navigate("/admin/hotels");
      } else if (loggedUser.role === "staff") {
        navigate("/app/dashboard");
      } else {
        navigate("/");
      }
    } catch (_err) {
      setError("Niepoprawny login lub haslo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/80 border border-secondary rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Logowanie</h1>
        <p className="text-sm text-muted mb-6">
          Wybierz role i zaloguj sie do systemu hotelowego.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            type="button"
            onClick={() => fillCredentials("guest")}
            className={`px-3 py-2 rounded-xl border ${
              role === "guest" ? "bg-primary text-white border-primary" : "border-secondary"
            }`}
          >
            Gosc
          </button>
          <button
            type="button"
            onClick={() => fillCredentials("staff")}
            className={`px-3 py-2 rounded-xl border ${
              role === "staff" ? "bg-primary text-white border-primary" : "border-secondary"
            }`}
          >
            Staff
          </button>
          <button
            type="button"
            onClick={() => fillCredentials("admin")}
            className={`px-3 py-2 rounded-xl border ${
              role === "admin" ? "bg-primary text-white border-primary" : "border-secondary"
            }`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            id="username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-secondary"
            placeholder="Login"
          />
          <input
            id="password"
            name="password"
            autoComplete="current-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-secondary"
            placeholder="Haslo"
          />

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-primary text-white disabled:opacity-60"
          >
            {loading ? "Logowanie..." : "Zaloguj"}
          </button>
        </form>
      </div>
    </div>
  );
}
