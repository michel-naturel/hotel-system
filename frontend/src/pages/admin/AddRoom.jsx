import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function AddRoom() {
  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");

  const [number, setNumber] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    api.get("/hotels").then(res => {
      setHotels(res.data);
      if (res.data.length > 0) {
        setHotelId(res.data[0].id);
      }
    });
  }, []);

  const submit = async () => {
    if (!number || !type || !price || !hotelId) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    await api.post("/rooms", {
      number,
      type,
      price: Number(price),
      hotelId
    });

    navigate("/admin/hotels");
  };

  return (
    <div className="max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Dodaj pokój
      </h1>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-6">

        <select
          value={hotelId}
          onChange={e => setHotelId(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
        >
          {hotels.map(h => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>

        <input
          className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
          placeholder="Numer pokoju"
          value={number}
          onChange={e => setNumber(e.target.value)}
        />

        <input
          className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
          placeholder="Typ (np. single, double)"
          value={type}
          onChange={e => setType(e.target.value)}
        />

        <input
          className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
          placeholder="Cena"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <button
          onClick={submit}
          className="px-6 py-2 rounded-xl bg-primary text-white"
        >
          Dodaj
        </button>

      </div>

    </div>
  );
}