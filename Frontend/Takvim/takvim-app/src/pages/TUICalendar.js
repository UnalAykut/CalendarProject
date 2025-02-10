import React, { useEffect, useRef, useState } from "react";
import Calendar from "@toast-ui/calendar";
import Sidebar from "../components/Sidebar";
import "tui-calendar/dist/tui-calendar.css";
import "../styles/TUICalendarCss.css";

const TUICalendarPage = () => {
  const calendarRef = useRef(null); // TUI Calendar referansı
  const calendarInstance = useRef(null); // Calendar sınıfının örneği
  const [events] = useState([
    {
      id: "1",
      title: "My Calendar Event",
      start: "2025-01-01T13:00:00",
      end: "2025-01-01T14:30:00",
      category: "time",
    },
    {
      id: "2",
      title: "Meeting with Client",
      start: "2025-01-03T09:00:00",
      end: "2025-01-03T10:00:00",
      category: "time",
    },
  ]);
  

  useEffect(() => {
    // TUI Calendar'ı başlat
    calendarInstance.current = new Calendar(calendarRef.current, {
      defaultView: "month",
      taskView: false,
      scheduleView: ["time"],
      useCreationPopup: false,
      useDetailPopup: true,
      template: {
        time: (schedule) => `<span style="color: white;">${schedule.title}</span>`,
      },
    });

    // Olayları yükle
    calendarInstance.current.setOptions({
      schedules: events, // Olayları doğrudan takvime yükleyin
    });

    return () => {
      calendarInstance.current.destroy(); // Calendar temizliği
    };
  }, [events]);

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="text-center">TUI Calendar</h1>
          <div>
            <button className="btn btn-secondary me-2">Monthly</button>
            <button className="btn btn-primary">New Schedule</button>
          </div>
        </div>
        <div className="legend">
          <span className="legend-item" style={{ color: "#007bff" }}>My Calendar</span>
          <span className="legend-item" style={{ color: "#17a2b8" }}>Company</span>
          <span className="legend-item" style={{ color: "#dc3545" }}>Family</span>
          <span className="legend-item" style={{ color: "#28a745" }}>Friend</span>
          <span className="legend-item" style={{ color: "#ffc107" }}>Travel</span>
          <span className="legend-item" style={{ color: "#fd7e14" }}>Birthdays</span>
          <span className="legend-item" style={{ color: "#343a40" }}>National Holidays</span>
        </div>
        <div ref={calendarRef} style={{ height: "800px", marginTop: "20px" }}></div>
      </div>
    </div>
  );
};

export default TUICalendarPage;
