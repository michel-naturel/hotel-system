import Calendar from "../Calendar";

export default function AdminCalendar() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">
        Kalendarz rezerwacji
      </h1>

      <Calendar />
    </div>
  );
}