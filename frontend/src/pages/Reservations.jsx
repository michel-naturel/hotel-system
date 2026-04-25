import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/api";

export default function Reservations() {
  const { hotelId } = useOutletContext();
  const [data, setData] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
  const load = async () => {
    const roomsRes = await api.get(`/rooms?hotelId=${hotelId}`);
    const resRes = await api.get("/reservations");

    setRooms(roomsRes.data);

    const filtered = resRes.data.filter(r => {
      const room = roomsRes.data.find(room => room.id === r.roomId);
      return room?.hotelId === hotelId;
    });

    setData(filtered);
  };

  if (hotelId) load();
}, [hotelId]);

  return (
    <div>

      <h1 className="text-2xl font-semibold mb-8">Reservations</h1>

      <div className="grid gap-4">

        {data.map(r => {
  const room = rooms.find(room => room.id === r.roomId);

  return (
    <div
      key={r.id}
      className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-5 flex justify-between items-center"
    >
      <div>
        <div className="font-medium text-lg">{r.guestName}</div>

        <div className="text-sm text-muted">
          {r.fromDate} → {r.toDate}
        </div>

        <div className="text-xs text-muted mt-1">
          Pokój: {room?.number || "—"}
        </div>
      </div>

      <div className="text-sm bg-secondary px-3 py-1 rounded-lg">
        Active
      </div>
    </div>
  );
})}

      </div>

    </div>
  );
}