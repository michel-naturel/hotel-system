import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/api";

export default function NewReservation() {
  const { hotelId } = useOutletContext();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState("");

  const search = async () => {
    if (!from || !to) return alert("Wybierz daty");

    if (to <= from) return alert("Data końcowa musi być późniejsza");

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

    await api.post("/reservations", {
      roomId: selectedRoom,
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
            onChange={e => setFrom(e.target.value)}
          />

          <input
            className="px-3 py-2 rounded-xl border border-secondary"
            type="date"
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