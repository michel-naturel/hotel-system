import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/api";

export default function Reservations() {
  const { hotelId } = useOutletContext();
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/reservations", { params: { hotelId } }).then(res => {
      setData(res.data);
    });
  }, [hotelId]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Reservations</h1>
      <div className="grid gap-4">
        {data.map(r => (
          <div
            key={r.id}
            className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-5 flex justify-between items-center"
          >
            <div>
              <div className="font-medium text-lg">{r.guestName}
              </div>
              <div className="text-sm text-muted">
                {r.fromDate} → {r.toDate}
              </div>
              <div className="text-xs text-muted mt-1">
                Room: {r.number}
              </div>
            </div>
            <div className="text-sm bg-secondary px-3 py-1 rounded-lg">
              Active
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}