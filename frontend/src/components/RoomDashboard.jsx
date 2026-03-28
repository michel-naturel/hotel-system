import { useState, useEffect } from "react";
import Calendar from "../pages/Calendar";

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
  const save = () => {
    const confirmSave = window.confirm("Zapisać zmiany?");
    if (!confirmSave) return;

    // ⚠️ NIE mutujemy propsów (ważne!)
    // tu docelowo będzie API call

    setEdit(false);
  };

  return (
    <div>
      {/* 🔙 BACK */}
      <button
        onClick={onBack}
        className="mb-4 text-sm underline"
      >
        ← Wróć
      </button>

      {/* 🧾 CARD */}
      <div className="bg-white p-6 rounded-2xl border mb-6">
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