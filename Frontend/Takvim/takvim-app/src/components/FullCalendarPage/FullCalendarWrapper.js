import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import "../css/FullCalendarWrapperCss.css"

const FullCalendarWrapper = ({ events, handleDateClick, handleEventClick }) => {
  return (
    <div className="full-calendar-wrapper">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map((event) => ({
          title: event.title,
          start: event.start,
          className: event.className,
        }))}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        locale="tr"
        noEventsText="Gösterilecek etkinlik yok"
        allDayText="Günler"
        headerToolbar={{
          left: "prev today next", // Sol tarafta Today ve navigasyon butonları
          center: "title",         // Ortada başlık (örneğin Ocak 2025)
          right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth", // Sağda görünüm seçenekleri
        }}
        buttonText={{
          today: "Bugün",       // Today düğmesi için metin
          month: "Ay",          // Month görünümü
          week: "Hafta",        // Week görünümü
          day: "Gün",           // Day görünümü
          list: "Liste",        // List görünümü
        }}
        eventTimeFormat={{
          hour: "2-digit", // Saat 2 haneli
          minute: "2-digit", // Dakika 2 haneli
          meridiem: false, // AM/PM gösterilmez
          hour12: false, // 24 saat formatı
        }}
      />
    </div>
  );
};

export default FullCalendarWrapper;
