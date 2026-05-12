import { useState, useEffect } from "react";
import Calendar from "../pages/Calendar";
import { api } from "../api/api";

export default function RoomDashboard({ room, onBack }) {
  // 🛡️ Guard — brak danych = nic nie renderujemy
  if (!room) return null;

  // 🔧 lokalny state (niezależny od propsów)
  const [edit, setEdit] = useState(false);
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  // 🔄 synchronizacja z room
  useEffect(() => {
    setType(room.type || "");
    setPrice(room.price || "");
  }, [room]);

  // 💾 zapis (na razie lokalny — MVP)
 const save = async () => {
    try {
      await api.put(`/rooms/${room.id}`, {
        number: room.number, // backend wymaga numeru
        type: type,
        price: Number(price)
      });
      alert("Zmiany zostały zapisane!");
      setEdit(false);
      // Możesz wywołać onBack() lub odświeżyć dane, żeby admin widział zmiany
      window.location.reload(); 
    } catch (err) {
      alert("Błąd zapisu: " + (err.response?.data?.message || "Błąd serwera"));
    }
  };

  // 2. USUWANIE POKOJU
  const deleteRoom = async () => {
    if (!window.confirm(`Czy na pewno chcesz usunąć pokój ${room.number}?`)) return;

    try {
      await api.delete(`/rooms/${room.id}`);
      alert("Pokój został usunięty.");
      onBack(); // Powrót do listy pokoi po usunięciu
    } catch (err) {
      alert("Błąd usuwania: " + (err.response?.data?.message || "Błąd serwera"));
    }
  };

  return (
    <div className="relative">
      {/* 🔙 BACK */}
      <button
        onClick={onBack}
        className="mb-4 text-sm underline"
      >
        ← Wróć
      </button>

      {/* 🧾 CARD */}
      <div className="bg-white p-6 rounded-2xl border mb-6 relative">
        <button 
          onClick={deleteRoom}
          className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full transition"
          title="Usuń pokój"
        >
          <span className="text-xl font-bold">✕</span>
        </button>
        <div className="text-xl font-semibold mb-4">
          Room {room.number}
        </div>

        <div>ID: {room.id}</div>

        {/* 🛏️ TYPE */}
        <div className="mt-2">
          Typ:
          {edit ? (
            <input
              value={type}
              onChange={e => setType(e.target.value)}
              className="ml-2 border px-2 py-1 rounded"
            />
          ) : (
            <span className="ml-2">{room.type}</span>
          )}
        </div>

        {/* 💰 PRICE */}
        <div className="mt-2">
          Cena:
          {edit ? (
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              className="ml-2 border px-2 py-1 rounded"
            />
          ) : (
            <span className="ml-2">{room.price} zł</span>
          )}
        </div>

        {/* 🔘 ACTION */}
        <button
          onClick={() => (edit ? save() : setEdit(true))}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-xl"
        >
          {edit ? "Zapisz" : "Edytuj"}
        </button>
      </div>

      {/* 📅 CALENDAR */}
{/*    <Calendar roomId={room.id} /> */}  {/* tu docelowo będzie kalendarz z rezerwacjami */}
    </div>
  );
}