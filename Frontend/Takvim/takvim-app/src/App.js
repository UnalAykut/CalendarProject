import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome"; // Hoşgeldiniz bileşeni
import Home from "./pages/Home"; // Ana sayfa bileşeni
import AdminLogin from "./pages/AdminLogin"; // Ana sayfa bileşeni
import Dashboard from "./pages/Dashboard";
import FullCalendarPage from "./pages/FullCalendar"
import CreateCalendar from "./pages/CreateCalendar"
import TUICalendar from "./pages/TUICalendar";
import CalendarView from "./pages/CalendarView";
import AcademicCalendar from "./pages/AcademicCalendar";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-continue" element={<Dashboard />} />
        <Route path="/full-calendar" element={<FullCalendarPage />} />
        <Route path="/create-calendar" element={<CreateCalendar />} />
        <Route path="/calendar/:id" element={<FullCalendarPage />} />
        <Route path="/tui-calendar" element={<TUICalendar />} />
        <Route path="/calendar-view/:id" element={<CalendarView />} />
        <Route path="/akademik-calendar" element={<AcademicCalendar />} />
      </Routes>
    </Router>
  );
};

export default App;
