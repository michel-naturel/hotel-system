import { useEffect, useState } from "react";
import { api } from "../../api/api";
import Calendar from "../Calendar";
import RoomDashboard from "../../components/RoomDashboard";

export default function Hotels() {
  const [view, setView] = useState("hotels"); // hotels | rooms | room
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    api.get("/hotels").then(res => setHotels(res.data));
  }, []);

  const openHotel = async (hotel) => {
    setSelectedHotel(hotel);
    const res = await api.get(`/rooms?hotelId=${hotel.id}`);
    setRooms(res.data);
    setView("rooms");
  };

  const openRoom = (room) => {
    setSelectedRoom(room);
    setView("room");
  };

  return (
    <div>

      <h1 className="text-2xl font-semibold mb-6">
        Zarządzanie hotelem
      </h1>

      {/* 🔹 HOTELS */}
      {view === "hotels" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map(h => (
            <div
              key={h.id}
              onClick={() => openHotel(h)}
              className="cursor-pointer p-6 rounded-2xl border bg-white hover:shadow"
            >
              <div className="font-medium">{h.name}</div>
              <div className="text-sm text-muted">{h.address}</div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 ROOMS */}
      {view === "rooms" && (
        <div>

          <button
            onClick={() => setView("hotels")}
            className="mb-4 text-sm underline"
          >
            ← Wróć
          </button>

          <h2 className="mb-4">{selectedHotel.name}</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map(r => (
              <div
                key={r.id}
                onClick={() => openRoom(r)}
                className="cursor-pointer p-5 rounded-2xl border bg-white hover:shadow"
              >
                Room {r.number}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 🔹 ROOM DASHBOARD */}
      {view === "room" && (
        <RoomDashboard
          room={selectedRoom}
          hotelId={selectedHotel.id}
          onBack={() => setView("rooms")}
        />
      )}

    </div>
  );
}