import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/api";

const DAY_MS = 86400000;

// spójne z kalendarzem
function toDayNumber(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

export default function NewReservation() {
  const { hotelId } = useOutletContext();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState("");

  const todayStr = new Date().toISOString().slice(0, 10);

  const search = async () => {
    if (!from || !to) return alert("Wybierz daty");

    const fromDay = toDayNumber(from);
    const toDay = toDayNumber(to);
    const todayDay = toDayNumber(todayStr);

    // blokada przeszłości
    if (fromDay < todayDay) {
      return alert("Nie można rezerwować w przeszłości");
    }

    // poprawna logika hotelowa (min 1 noc)
    if (toDay <= fromDay) {
      return alert("Data końcowa musi być późniejsza niż początkowa");
    }

    const res = await api.get(
      `/rooms/available?fromDate=${from}&toDate=${to}&hotelId=${hotelId}`
    );

    setRooms(res.data);
  };

  const book = async () => {
    if (!selectedRoom || !name) {
      alert("Wybierz pokój i wpisz imię");
      return;
    }

    const fromDay = toDayNumber(from);
    const toDay = toDayNumber(to);
    const todayDay = toDayNumber(todayStr);

    // dodatkowa walidacja bezpieczeństwa
    if (fromDay < todayDay) {
      return alert("Nie można rezerwować w przeszłości");
    }

    if (toDay <= fromDay) {
      return alert("Nieprawidłowy zakres dat");
    }

    const raw = localStorage.getItem("authUser");
    const user = JSON.parse(raw);

    await api.post("/reservations", {
      roomId: selectedRoom,
      customerId: user.id,
      guestName: name,
      fromDate: from,
      toDate: to,
      hotelId
    });

    setRooms([]);
    setSelectedRoom(null);
    setName("");

    window.location.href = "/app/reservations";
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">New reservation</h1>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-6 mb-6">

        <div className="flex gap-3 mb-4">

          <input
            className="px-3 py-2 rounded-xl border border-secondary"
            type="date"
            min={todayStr} // blokada w UI
            value={from}
            onChange={e => setFrom(e.target.value)}
          />

          <input
            className="px-3 py-2 rounded-xl border border-secondary"
            type="date"
            min={from || todayStr} // nie pozwala wybrać wcześniejszej daty końca
            value={to}
            onChange={e => setTo(e.target.value)}
          />

          <button
            onClick={search}
            className="px-4 rounded-xl bg-primary text-white text-sm"
          >
            Search
          </button>

        </div>

        <div className="grid gap-3">

          {rooms.map(r => (
            <div
              key={r.id}
              className={`p-4 rounded-xl border transition flex justify-between ${
                selectedRoom === r.id
                  ? "bg-secondary border-primary"
                  : "bg-white/60 border-secondary"
              }`}
            >
              <div>
                Room {r.number} — {r.type} — {r.price} zł
              </div>

              <button
                onClick={() => setSelectedRoom(r.id)}
                className="px-3 py-1 rounded-lg bg-primary text-white text-sm"
              >
                Select
              </button>
            </div>
          ))}

        </div>

        <input
          className="mt-6 px-3 py-2 rounded-xl border border-secondary w-full max-w-sm"
          placeholder="Guest name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <button
          onClick={book}
          className="mt-4 px-6 py-2 rounded-xl bg-primary text-white"
        >
          Book
        </button>

      </div>
    </div>
  );
}