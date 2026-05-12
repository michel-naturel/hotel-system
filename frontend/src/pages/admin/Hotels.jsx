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

  // --- FUNKCJE USUWANIA ---

  const deleteHotel = async (e, hotelId, hotelName) => {
    e.stopPropagation(); // Ważne: nie otwiera widoku pokoi przy kliknięciu w X
    if (!window.confirm(`Czy na pewno chcesz usunąć hotel "${hotelName}"? Wszystkie pokoje w tym hotelu zostaną usunięte.`)) {
      return;
    }

    try {
      await api.delete(`/hotels/${hotelId}`);
      setHotels(hotels.filter((h) => h.id !== hotelId));
      alert("Hotel został usunięty");
    } catch (err) {
      alert("Błąd usuwania hotelu: " + (err.response?.data?.message || "Brak uprawnień"));
    }
  };

  const deleteRoomFromList = async (e, roomId, roomNumber) => {
    e.stopPropagation(); // Ważne: nie otwiera Dashboardu przy kliknięciu w X
    if (!window.confirm(`Czy na pewno chcesz usunąć pokój numer ${roomNumber}?`)) {
      return;
    }

    try {
      await api.delete(`/rooms/${roomId}`);
      setRooms(rooms.filter((r) => r.id !== roomId));
      alert("Pokój został usunięty");
    } catch (err) {
      alert("Błąd usuwania pokoju: " + (err.response?.data?.message || "Brak uprawnień"));
    }
  };

return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Zarządzanie hotelem</h1>

      {/* 🔹 WIDOK: LISTA HOTELI */}
      {view === "hotels" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((h) => (
            <div
              key={h.id}
              onClick={() => openHotel(h)}
              className="group relative cursor-pointer p-6 rounded-2xl border bg-white hover:shadow-md transition"
            >
              {/* Przycisk usuwania hotelu */}
              <button
                onClick={(e) => deleteHotel(e, h.id, h.name)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Usuń hotel"
              >
                ✕
              </button>

              <div className="font-medium text-lg pr-6">{h.name}</div>
              <div className="text-sm text-muted">{h.address}</div>
            </div>
          ))}
          {hotels.length === 0 && <div className="text-muted">Brak hoteli w bazie.</div>}
        </div>
      )}

      {/* 🔹 WIDOK: LISTA POKOI W HOTELU */}
      {view === "rooms" && (
        <div>
          <button
            onClick={() => setView("hotels")}
            className="mb-4 text-sm underline flex items-center gap-1 hover:text-primary"
          >
            ← Wróć do listy hoteli
          </button>

          <h2 className="text-xl mb-4 font-medium">Hotel: {selectedHotel?.name}</h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((r) => (
              <div
                key={r.id}
                onClick={() => openRoom(r)}
                className="group relative cursor-pointer p-5 rounded-2xl border bg-white hover:shadow-md transition"
              >
                {/* Przycisk usuwania pokoju */}
                <button
                  onClick={(e) => deleteRoomFromList(e, r.id, r.number)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Usuń pokój"
                >
                  ✕
                </button>

                <div className="font-semibold text-lg">Pokój {r.number}</div>
                <div className="text-sm text-muted">{r.type}</div>
                <div className="mt-2 font-medium text-primary">{r.price} zł / noc</div>
              </div>
            ))}
            {rooms.length === 0 && <div className="text-muted">Ten hotel nie ma jeszcze dodanych pokoi.</div>}
          </div>
        </div>
      )}

      {/* 🔹 WIDOK: DASHBOARD POKOJU (Edycja ceny itp.) */}
      {view === "room" && (
        <RoomDashboard
          room={selectedRoom}
          hotelId={selectedHotel?.id}
          onBack={() => {
            // Po powrocie odświeżamy listę pokoi, żeby widzieć np. nową cenę
            openHotel(selectedHotel);
          }}
        />
      )}
    </div>
  );
}