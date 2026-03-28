import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/api";


function getDates() {
  const dates = [];
  const start = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates;
}

function daysBetween(start, end) {
  return (
    (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24)
  );
}

export default function Calendar() {
  
  const { hotelId } = useOutletContext();

  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [hovered, setHovered] = useState(null);

  const dates = getDates();

  const loadData = async () => {
    const roomsRes = await api.get(`/rooms?hotelId=${hotelId}`);
    const resRes = await api.get("/reservations");

    setRooms(roomsRes.data);
    setReservations(resRes.data.filter(r => r.hotelId === hotelId));
  };

  useEffect(() => {
    loadData();
  }, [hotelId]);

  const deleteReservation = async (r) => {
    const confirmDelete = window.confirm(
      `Usunąć rezerwację?\n\n${r.guestName}\n${r.fromDate} → ${r.toDate}`
    );

    if (!confirmDelete) return;

    await api.delete(`/reservations/${r.id}`);
    loadData();
  };

  return (
    <div>

      <h1 className="text-2xl font-semibold mb-8">Kalendarz</h1>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-4 overflow-x-auto">

        {/* HEADER */}
        <div className="grid grid-cols-8 gap-2 mb-3 text-xs text-muted">
          <div></div>
          {dates.map(d => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        {/* ROWS */}
        {rooms.map(room => (
          <div key={room.id} className="grid grid-cols-8 gap-2 mb-2 relative">

            <div className="text-sm font-medium flex items-center">
              {room.number}
            </div>

            {dates.map(d => (
              <div key={d} className="h-12 bg-secondary/40 rounded-xl" />
            ))}

            {reservations
              .filter(r => r.roomId === room.id)
              .map(r => {
                const startIndex = dates.findIndex(d => d === r.fromDate);
                const length = daysBetween(r.fromDate, r.toDate);

                if (startIndex === -1) return null;

                return (
                  <div
                    key={r.id}
                    onMouseEnter={() => setHovered(r.id)}
                    onMouseLeave={() => setHovered(null)}
                    className="absolute top-1 h-10 bg-primary text-white text-xs flex items-center px-3 rounded-xl shadow-sm cursor-pointer"
                    style={{
                      left: `${(startIndex + 1) * 12.5}%`,
                      width: `${length * 12.5}%`,
                      zIndex: 10
                    }}
                  >
                    <span className="flex-1 truncate">{r.guestName}</span>

                    <button
                      onClick={() => deleteReservation(r)}
                      className="ml-2 opacity-70 hover:opacity-100"
                    >
                      ✕
                    </button>

                    {hovered === r.id && (
                      <div className="absolute top-12 left-0 bg-white border border-secondary text-xs p-3 rounded-xl shadow-md z-50 w-44 text-text">
                        <div className="font-medium">{r.guestName}</div>
                        <div className="text-muted">{r.fromDate}</div>
                        <div className="text-muted">→ {r.toDate}</div>
                      </div>
                    )}
                  </div>
                );
              })}

          </div>
        ))}

      </div>

    </div>
  );
}