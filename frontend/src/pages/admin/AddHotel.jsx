import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";

export default function AddHotel() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const submit = async () => {
    if (!name || !address) {
      alert("Uzupełnij wszystkie pola");
      return;
    }

    await api.post("/hotels", {
      name,
      address
    });

    navigate("/admin/hotels");
  };

  return (
    <div className="max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Dodaj hotel
      </h1>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-6">

        <input
          className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
          placeholder="Nazwa hotelu"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="w-full mb-4 px-3 py-2 rounded-xl border border-secondary"
          placeholder="Adres"
          value={address}
          onChange={e => setAddress(e.target.value)}
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