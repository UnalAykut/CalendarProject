import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Takvim bilgisi için
import FullCalendar from "@fullcalendar/react"; // FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid";
import "../styles/CalendarViewCss.css";

const CalendarView = () => {
  const location = useLocation();
  const calendar = location.state?.calendar; // Home.js'den gelen takvim bilgisi
  const [events, setEvents] = useState([]); // Olayları saklamak için
  const [selectedDate, setSelectedDate] = useState(null); // Seçili tarih

  // Sadece bu sayfa için body arka planını değiştir
  useEffect(() => {
    document.body.style.backgroundColor = "whitesmoke";
    document.body.style.backgroundImage = "none";

    if (calendar?.events) {
      setEvents(
        calendar.events.map((event) => ({
          id: event.eventID,
          title: event.title,
          start: event.startDate,
          end: event.endDate || event.startDate,
          className: event.color || "bg-primary",
          description: event.description || "Açıklama yok",
        }))
      );
    }

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
    };
  }, [calendar]);

  // Belirli Tarihin Olaylarını Filtreleme
  const filterEventsByDate = (date) => {
    if (!date) return events;
    return events.filter(
      (event) =>
        new Date(event.start).toDateString() === new Date(date).toDateString()
    );
  };

  // Takvimi ICS Formatında Dışa Aktarma
  const exportToICS = () => {
    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\n`;

    events.forEach((event) => {
      icsContent += `BEGIN:VEVENT\n`;
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DESCRIPTION:${event.description}\n`;
      icsContent += `DTSTART:${new Date(event.start)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0]}Z\n`;
      icsContent += `DTEND:${new Date(event.end || event.start)
        .toISOString()
        .replace(/[-:]/g, "")
        .split(".")[0]}Z\n`;
      icsContent += `END:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${calendar?.name || "takvim"}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Takvimi CSV Formatında Dışa Aktarma
  const exportToCSV = () => {
    const csvHeader = "Başlık,Açıklama,Başlangıç Tarihi,Bitiş Tarihi\n";
    const csvRows = events.map(
      (event) =>
        `${event.title},${event.description},"${new Date(event.start).toLocaleString()}","${
          event.end ? new Date(event.end).toLocaleString() : new Date(event.start).toLocaleString()
        }"`
    );
    const csvContent = csvHeader + csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${calendar?.name || "takvim"}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Takvimi VSC Formatında Dışa Aktarma
const exportToVSC = () => {
  const vscContent = `
const calendarEvents = [
${events
  .map(
    (event) => `  {
    title: "${event.title}",
    description: "${event.description}",
    start: "${new Date(event.start).toISOString()}",
    end: "${event.end ? new Date(event.end).toISOString() : new Date(event.start).toISOString()}",
    className: "${event.className}"
  }`
  )
  .join(",\n")}
];

export default calendarEvents;
`;

  const blob = new Blob([vscContent], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${calendar?.name || "takvim"}.js`;
  link.click();
  URL.revokeObjectURL(url);
};


  return (
    <div className="calendar-view-container">
      <header className="calendar-view-header">
        <h1>{calendar?.name || "Takvim Görünümü"}</h1>
        <p>Oluşturulma Tarihi: {new Date(calendar?.createdDate).toLocaleString()}</p>
        <button className="btn btn-primary me-2" onClick={exportToICS}>
          Takvimi Dışa Aktar (ICS)
        </button>
        <button className="btn btn-secondary" onClick={exportToCSV}>
          Takvimi Dışa Aktar (CSV)
        </button>
         <button className="btn btn-secondary" onClick={exportToVSC}>
          Takvimi Dışa Aktar (VSC)
        </button>
      </header>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={filterEventsByDate(selectedDate)}
        eventClick={(info) => setSelectedDate(info.event.start)} // Tarihi filtrelemek için
      />
    </div>
  );
};

export default CalendarView;
