import { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { api } from "../api/api";

const DAY_MS = 86400000;

function toDayNumber(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

export default function RoomDetails() {
  const { roomId } = useParams();
  const { hotelId } = useOutletContext();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [reservations, setReservations] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [guestName, setGuestName] = useState("");

  const todayStr = new Date().toISOString().slice(0, 10);

  // 🔹 pobierz pokój
  useEffect(() => {
    if (!hotelId) return;

    api.get(`/rooms?hotelId=${hotelId}`).then(res => {
      const found = res.data.find(r => r.id === roomId);
      setRoom(found);
    });
  }, [roomId, hotelId]);

  // 🔹 pobierz rezerwacje
  const loadReservations = async () => {
    const res = await api.get("/reservations");

    const filtered = res.data
      .filter(r => r.roomId === roomId)
      .sort((a, b) => {
        if (!a.fromDate || !b.fromDate) return 0;
        return new Date(b.fromDate) - new Date(a.fromDate);
      });

    setReservations(filtered);
  };

  useEffect(() => {
    loadReservations();
  }, [roomId]);

  // 🔹 dodanie rezerwacji (POPRAWIONE)
  const handleAdd = async () => {
    if (!guestName) {
      return alert("Wpisz imię gościa");
    }

    if (!fromDate || !toDate) {
      return alert("Wybierz daty");
    }

    const fromDay = toDayNumber(fromDate);
    const toDay = toDayNumber(toDate);
    const todayDay = toDayNumber(todayStr);

    if (fromDay < todayDay) {
      return alert("Nie można rezerwować w przeszłości");
    }

    if (toDay <= fromDay) {
      return alert("Data końcowa musi być późniejsza niż początkowa");
    }

    await api.post("/reservations", {
      roomId,
      hotelId,
      fromDate,
      toDate,
      guestName
    });

    // reset
    setFromDate("");
    setToDate("");
    setGuestName("");

    // refresh listy
    await loadReservations();
  };

  if (!room) return <div>Ładowanie...</div>;

  return (
    <div className="space-y-6">

      {/* 🔙 BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-muted hover:underline"
      >
        ← Wróć
      </button>

      {/* 🏨 HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">
          Pokój {room.number}
        </h1>
        <div className="text-muted text-sm">
          {room.type} • {room.price} zł / noc
        </div>
      </div>

      {/* ➕ FORMULARZ (NOWY, POPRAWNY) */}
      <div className="bg-white/70 p-4 rounded-xl border border-secondary flex flex-col gap-3 max-w-xl">

        <div className="flex gap-3 flex-wrap">

          <input
            type="date"
            min={todayStr}
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <input
            type="date"
            min={fromDate || todayStr}
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />

        </div>

        <input
          placeholder="Imię i nazwisko gościa"
          value={guestName}
          onChange={e => setGuestName(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={handleAdd}
          className="bg-primary text-white px-4 py-2 rounded-lg w-fit"
        >
          Dodaj rezerwację
        </button>

      </div>

      {/* 📋 LISTA REZERWACJI */}
      <div className="space-y-3">
        {reservations.map(r => (
          <div
            key={r.id}
            className="bg-white/70 border border-secondary rounded-xl p-4"
          >
            <div className="font-medium">{r.guestName}</div>

            <div className="text-sm text-muted">
              {r.fromDate} → {r.toDate}
            </div>
          </div>
        ))}

        {reservations.length === 0 && (
          <div className="text-muted text-sm">
            Brak rezerwacji dla tego pokoju
          </div>
        )}
      </div>

    </div>
  );
}