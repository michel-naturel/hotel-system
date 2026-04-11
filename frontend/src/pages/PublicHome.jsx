import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import GuestTopbar from "../components/GuestTopbar";

const DAY_MS = 86400000;

// spójny model czasu
function toDayNumber(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

export default function PublicHome() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");

  const navigate = useNavigate();

  const todayStr = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    api.get("/hotels").then(res => {
      setHotels(res.data);

      if (res.data.length > 0) {
        setHotelId(res.data[0].id);
      }
    });
  }, []);

  const search = async () => {
    if (!from || !to) return alert("Wybierz daty");

    const fromDay = toDayNumber(from);
    const toDay = toDayNumber(to);
    const todayDay = toDayNumber(todayStr);

    // blokada przeszłości
    if (fromDay < todayDay) {
      return alert("Nie można wyszukiwać w przeszłości");
    }

    // poprawna logika zakresu
    if (toDay <= fromDay) {
      return alert("Data końcowa musi być późniejsza niż początkowa");
    }

    const res = await api.get(
      `/rooms/available?fromDate=${from}&toDate=${to}&hotelId=${hotelId}`
    );

    setRooms(res.data);
  };

  const selectRoom = (room) => {
    navigate("/booking", {
      state: { room, from, to }
    });
  };

  return (
    <div className="min-h-screen bg-bg p-10">
      <div className="max-w-4xl mx-auto">
        <GuestTopbar />

        {/* HERO */}
        <h1 className="text-4xl font-semibold mb-8 text-center">
          Znajdź idealny pokój
        </h1>

        {/* SEARCH CARD */}
        <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-6 mb-8">

          <select
            className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
            value={hotelId}
            onChange={e => setHotelId(e.target.value)}
          >
            {hotels.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} — {h.address}
              </option>
            ))}
          </select>

          <div className="flex gap-3 flex-wrap">

            {/* FROM */}
            <input
              type="date"
              className="px-3 py-2 rounded-xl border border-secondary"
              min={todayStr}
              value={from}
              onChange={e => {
                setFrom(e.target.value);

                // reset TO jeśli nie pasuje
                if (to && e.target.value >= to) {
                  setTo("");
                }
              }}
            />

            {/* TO */}
            <input
              type="date"
              className="px-3 py-2 rounded-xl border border-secondary"
              min={from || todayStr}
              value={to}
              onChange={e => setTo(e.target.value)}
            />

            <button
              onClick={search}
              className="px-6 py-2 rounded-xl bg-primary text-white"
            >
              Search
            </button>

          </div>

        </div>

        {/* RESULTS */}
        <div className="grid gap-4">

          {rooms.map(r => (
            <div
              key={r.id}
              className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-5 flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-lg">
                  Room {r.number}
                </div>
                <div className="text-muted">
                  {r.type}
                </div>
                <div className="text-sm">
                  {r.price} zł / noc
                </div>
              </div>

              <button
                onClick={() => selectRoom(r)}
                className="px-4 py-2 rounded-xl bg-primary text-white"
              >
                Select
              </button>
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}