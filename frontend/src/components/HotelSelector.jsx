import { useEffect, useState } from "react";
import { api } from "../api/api";

export default function HotelSelector({ selected, setSelected }) {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    api.get("/hotels").then(res => setHotels(res.data));
  }, []);

  return (
    <div className="flex items-center gap-2">

      <span className="text-sm text-muted">Hotel:</span>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="px-3 py-2 rounded-xl bg-white border border-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
      >
        {hotels.map((h) => (
          <option key={h.id} value={h.id}>
            {h.name}
          </option>
        ))}
      </select>

    </div>
  );
}