import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { api } from "../api/api";

const DAYS = 7;
const DAY_MS = 86400000;

// integer timeline
function toDayNumber(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY_MS);
}

function fromDayNumber(day) {
  const date = new Date(day * DAY_MS);
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// NOWE — labelki
const MONTHS_PL = [
  "STYCZEŃ","LUTY","MARZEC","KWIECIEŃ","MAJ","CZERWIEC",
  "LIPIEC","SIERPIEŃ","WRZESIEŃ","PAŹDZIERNIK","LISTOPAD","GRUDZIEŃ"
];

function getYearLabel(startDay) {
  const start = new Date(startDay * DAY_MS);
  const end = new Date((startDay + DAYS - 1) * DAY_MS);

  const y1 = start.getUTCFullYear();
  const y2 = end.getUTCFullYear();

  return y1 === y2 ? `${y1}` : `${y1} / ${y2}`;
}

function getMonthLabel(startDay) {
  const start = new Date(startDay * DAY_MS);
  const end = new Date((startDay + DAYS - 1) * DAY_MS);

  const m1 = MONTHS_PL[start.getUTCMonth()];
  const m2 = MONTHS_PL[end.getUTCMonth()];

  return m1 === m2 ? m1 : `${m1} / ${m2}`;
}

export default function Calendar() {
  const { hotelId } = useOutletContext();

  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [hovered, setHovered] = useState(null);

  const todayStr = new Date().toISOString().slice(0, 10);
  const [visibleStart, setVisibleStart] = useState(toDayNumber(todayStr));

  const dates = Array.from({ length: DAYS }, (_, i) =>
    fromDayNumber(visibleStart + i)
  );

  const visibleEnd = visibleStart + DAYS;

  const loadData = async () => {
    const roomsRes = await api.get(`/rooms?hotelId=${hotelId}`);
    const resRes = await api.get("/reservations");

    setRooms(roomsRes.data);
    setReservations(resRes.data.filter(r => r.hotelId === hotelId));
  };

  useEffect(() => {
  if (!hotelId) return; // GUARD

  loadData();
  }, [hotelId]);

  const deleteReservation = async (r) => {
    if (
      !window.confirm(
        `Usunąć rezerwację?\n\n${r.guestName}\n${r.fromDate} → ${r.toDate}`
      )
    )
      return;

    await api.delete(`/reservations/${r.id}`);
    loadData();
  };

  // NAV
  const goNext = () => setVisibleStart(prev => prev + DAYS);
  const goPrev = () => setVisibleStart(prev => prev - DAYS);
  const goNextMonth = () => setVisibleStart(prev => prev + 30);
  const goPrevMonth = () => setVisibleStart(prev => prev - 30);
  const goNextYear = () => setVisibleStart(prev => prev + 365);
  const goPrevYear = () => setVisibleStart(prev => prev - 365);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Kalendarz</h1>

      {/* NOWY NAV */}
      <div className="mb-6">

        {/* ROK */}
        <div className="flex items-center justify-center gap-4 mb-1">
          <button onClick={goPrevYear} className="px-3 text-lg">←</button>
          <div className="text-lg font-semibold tracking-wide">
            {getYearLabel(visibleStart)}
          </div>
          <button onClick={goNextYear} className="px-3 text-lg">→</button>
        </div>

        {/* MIESIĄC */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={goPrevMonth} className="px-3">←</button>
          <div className="text-sm text-muted tracking-wide">
            {getMonthLabel(visibleStart)}
          </div>
          <button onClick={goNextMonth} className="px-3">→</button>
        </div>

        {/* DNI */}
        <div className="flex justify-between items-center px-2">
          <button
            onClick={goPrev}
            className="px-3 py-1 bg-secondary rounded"
          >
            ←
          </button>

          <button
            onClick={goNext}
            className="px-3 py-1 bg-secondary rounded"
          >
            →
          </button>
        </div>

      </div>

      <div className="bg-white/70 backdrop-blur border border-secondary rounded-2xl p-4 overflow-x-auto">

        {/* HEADER */}
        <div
          className="grid gap-2 mb-3 text-xs text-muted"
          style={{ gridTemplateColumns: `120px repeat(${DAYS}, 1fr)` }}
        >
          <div></div>
          {dates.map(d => (
            <div key={d} className="text-center">
              {d}
            </div>
          ))}
        </div>

        {/* ROWS */}
        {rooms.map(room => (
          <div key={room.id} className="relative mb-2">

            {/* TŁO */}
            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `120px repeat(${DAYS}, 1fr)` }}
            >
              <div className="text-sm font-medium flex items-center">
                {room.number}
              </div>

              {dates.map(d => (
                <div key={d} className="h-12 bg-secondary/40 rounded-xl" />
              ))}
            </div>

            {/* OVERLAY */}
            <div
              className="absolute inset-0 grid pointer-events-none"
              style={{ gridTemplateColumns: `120px repeat(${DAYS}, 1fr)` }}
            >
              {reservations
                .filter(r => r.roomId === room.id)
                .map(r => {
                  const rStart = toDayNumber(r.fromDate);
                  const rEnd = toDayNumber(r.toDate);

                  if (rEnd <= visibleStart || rStart >= visibleEnd) return null;

                  const start = Math.max(rStart, visibleStart);
                  const end = Math.min(rEnd, visibleEnd);

                  const offset = start - visibleStart;
                  const length = end - start;

                  if (length <= 0) return null;

                  return (
                    <div
                      key={r.id}
                      onMouseEnter={() => setHovered(r.id)}
                      onMouseLeave={() => setHovered(null)}
                      className="h-10 bg-primary text-white text-xs flex items-center px-3 rounded-xl shadow-sm cursor-pointer pointer-events-auto overflow-hidden"
                      style={{
                        gridColumnStart: offset + 2,
                        gridColumnEnd: offset + 2 + length,
                        alignSelf: "center"
                      }}
                    >
                      <span className="truncate">{r.guestName}</span>

                      <button
                        onClick={() => deleteReservation(r)}
                        className="ml-2 opacity-70 hover:opacity-100"
                      >
                        ✕
                      </button>

                      {hovered === r.id && (
                        <div className="absolute top-12 left-0 bg-white border border-secondary text-xs p-3 rounded-xl shadow-md z-50 w-44 text-text">
                          <div className="font-medium">{r.guestName}</div>
                          <div className="text-muted">{r.fromDate}</div>
                          <div className="text-muted">→ {r.toDate}</div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}