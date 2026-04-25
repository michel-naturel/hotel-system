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
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoomDetails from "./pages/RoomDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* RECEPCJA */}
        <Route
          path="/app"
          element={
            <ProtectedRoute allowedRoles={["staff", "admin"]}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="reservations/new" element={<NewReservation />} />
          <Route path="calendar" element={<Calendar />} />
           {/* ROOM DETAILS */}
         <Route path="/app/rooms/:roomId" element={<RoomDetails />} />
        </Route>
        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
           <Route index element={<Navigate to="hotels" />} />
           
          <Route path="hotels" element={<Hotels />} />
          <Route path="add-hotel" element={<AddHotel />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
        </Route>

        

        {/* PUBLIC HOME */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["guest", "staff", "admin"]}>
              <PublicHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute allowedRoles={["guest", "staff", "admin"]}>
              <PublicBooking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/success"
          element={
            <ProtectedRoute allowedRoles={["guest", "staff", "admin"]}>
              <PublicSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/login" />} />

       

      </Routes>
    </BrowserRouter>
  );
}

export default App;