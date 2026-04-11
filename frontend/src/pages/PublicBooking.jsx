import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import GuestTopbar from "../components/GuestTopbar";

const DAY_MS = 86400000;

// spójny model czasu
function toDayNumber(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

export default function PublicBooking() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { room, from, to } = state || {};

  const [name, setName] = useState("");
  const [hotelName, setHotelName] = useState("");

  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. GUARD NA WEJŚCIU
  useEffect(() => {
    if (!room || !from || !to) {
      navigate("/");
      return;
    }

    const fromDay = toDayNumber(from);
    const toDay = toDayNumber(to);
    const todayDay = toDayNumber(todayStr);

    if (fromDay < todayDay || toDay <= fromDay) {
      alert("Nieprawidłowe daty rezerwacji");
      navigate("/");
    }
  }, [room, from, to]);

  // 2. FETCH HOTELU
  useEffect(() => {
    if (!room) return;

    const fetchHotel = async () => {
      const res = await api.get("/hotels");
      const hotel = res.data.find(h => h.id === room.hotelId);
      if (hotel) setHotelName(hotel.name);
    };

    fetchHotel();
  }, [room]);

  if (!room) {
    return <div className="p-10">Brak danych</div>;
  }

  // 3. BOOK (z dodatkowym zabezpieczeniem)
  const book = async () => {
    if (!name) {
      alert("Podaj imię");
      return;
    }

    const fromDay = toDayNumber(from);
    const toDay = toDayNumber(to);
    const todayDay = toDayNumber(todayStr);

    if (fromDay < todayDay) {
      return alert("Nie można rezerwować w przeszłości");
    }

    if (toDay <= fromDay) {
      return alert("Nieprawidłowy zakres dat");
    }

    await api.post("/reservations", {
      roomId: room.id,
      guestName: name,
      fromDate: from,
      toDate: to,
      hotelId: room.hotelId
    });

    navigate("/success");
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <GuestTopbar />

      <h1 className="text-2xl font-semibold mb-6">
        Rezerwacja pokoju
      </h1>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-6 mb-6">

        <div className="text-lg font-medium mb-2">
          Room {room.number}
        </div>

        <div className="text-muted">{room.type}</div>
        <div className="mb-2">{room.price} zł</div>

        <div className="text-sm text-muted">
          Hotel: {hotelName || room.hotelId}
        </div>

        <div className="text-sm text-muted mt-2">
          {from} → {to}
        </div>

      </div>

      <input
        className="px-3 py-2 rounded-xl border border-secondary w-full mb-4"
        placeholder="Twoje imię"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <button
        onClick={book}
        className="px-6 py-2 rounded-xl bg-primary text-white"
      >
        Zarezerwuj
      </button>

    </div>
  );
}