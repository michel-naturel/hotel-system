import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function GuestTopbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-full flex justify-end mb-6">
      <div className="flex items-center gap-3 text-sm text-muted">
        <span>{user?.role || "guest"}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-lg bg-secondary hover:bg-primary/20 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
