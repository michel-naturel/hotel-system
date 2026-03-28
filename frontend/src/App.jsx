import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import AdminLayout from "./layouts/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import NewReservation from "./pages/NewReservation";

import Calendar from "./pages/Calendar";

import Hotels from "./pages/admin/Hotels";

import PublicHome from "./pages/PublicHome";
import PublicBooking from "./pages/PublicBooking";
import PublicSuccess from "./pages/PublicSuccess";

import AddHotel from "./pages/admin/AddHotel";
import AddRoom from "./pages/admin/AddRoom";
import AdminCalendar from "./pages/admin/AdminCalendar";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* RECEPCJA */}
        <Route path="/app" element={<AppLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="reservations/new" element={<NewReservation />} />
          <Route path="calendar" element={<Calendar />} />
        </Route>
        {/* ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<Navigate to="hotels" />} />
           
          <Route path="hotels" element={<Hotels />} />
          <Route path="add-hotel" element={<AddHotel />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
        </Route>

        

        {/* PUBLIC HOME */}
        <Route path="/" element={<PublicHome />} />
        <Route path="/booking" element={<PublicBooking />} />
        <Route path="/success" element={<PublicSuccess />} />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/app/dashboard" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;