import { useEffect, useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { api } from "../api/api";

export default function Rooms() {
  const { hotelId } = useOutletContext();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get(`/rooms?hotelId=${hotelId}`).then(res => setRooms(res.data));
  }, [hotelId]);

  return (
    <div>

      <h1 className="text-2xl font-semibold mb-8">Rooms</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

        {rooms.map(r => (
          <div
            key={r.id}
            onClick={() => navigate("/app/new-reservation")}
            className="cursor-pointer bg-white/70 backdrop-blur border border-secondary rounded-2xl p-5 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
          >
            <div className="text-lg font-medium">
              Room {r.number}
            </div>

            <div className="text-muted text-sm">
              {r.type}
            </div>

            <div className="mt-2 text-sm">
              {r.price} zł / noc
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}