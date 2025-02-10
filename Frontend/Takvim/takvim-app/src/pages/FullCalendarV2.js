import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // CreateCalendar'dan gelen bilgiyi almak için
import Sidebar from "../components/Sidebar";
import CalendarModal from "../components/FullCalendarPage/CalendarModal";
import EventModal from "../components/FullCalendarPage/EventModal";
import ColorPicker from "../components/FullCalendarPage/ColorPicker";
import FullCalendarWrapper from "../components/FullCalendarPage/FullCalendarWrapper";
import { getCalendars, createCalendar, addEvent } from "../services/api";
import "../styles/FullCalendarCss.css";
import "bootstrap/dist/css/bootstrap.min.css";

const FullCalendarPage = () => {
  const location = useLocation(); // CreateCalendar'dan gelen bilgiyi alıyoruz
  const [events, setEvents] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [calendars, setCalendars] = useState([]);
  const [filteredCalendars, setFilteredCalendars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarID, setCalendarID] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-primary");
  const itemsPerPage = 5;

  // Sadece bu sayfa için body arka planını değiştir
  useEffect(() => {
    document.body.style.backgroundColor = "whitesmoke";
    document.body.style.backgroundImage = "none";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
    };
  }, []);

  // CreateCalendar'dan gelen takvimi kontrol et
  useEffect(() => {
    const calendarFromLocation = location.state?.calendar; // Navigate ile gelen takvim
    if (calendarFromLocation) {
      setCalendarName(calendarFromLocation.name); // Takvim adını ayarla
      setCalendarID(calendarFromLocation.calendarID); // Takvim ID'sini ayarla
      setEvents(
        calendarFromLocation.events?.map((event) => ({
          title: event.title,
          start: event.startDate,
          className: event.color || "bg-primary",
        })) || []
      );
      setShowCalendarModal(false); // Modalı kapalı tut
    }
  }, [location.state]);

  // Kayıtlı takvimleri getir
  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const data = await getCalendars();
        setCalendars(data);
        setFilteredCalendars(data);
      } catch (error) {
        console.error("Takvimler alınırken bir hata oluştu:", error);
      }
    };

    fetchCalendars();
  }, []);

  // Takvim seçildiğinde olaylarla birlikte getir
  const handleSelectCalendar = async (id) => {
    const selectedCalendar = calendars.find((calendar) => calendar.calendarID === id);

    if (selectedCalendar) {
      setCalendarID(id);
      setCalendarName(selectedCalendar.name);

      try {
        const calendarEvents = selectedCalendar.events.map((event) => ({
          title: event.title,
          start: event.startDate,
          className: event.color || "bg-primary",
        }));
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Takvim olayları alınırken bir hata oluştu:", error);
      }
    }

    setShowCalendarModal(false);
  };

  // Yeni olay ekleme
  const handleAddEvent = async () => {
    if (!eventTitle || selectedDates.length === 0) {
      alert("Lütfen bir başlık ve en az bir tarih seçin.");
      return;
    }

    try {
      const newEvents = selectedDates.map((date) => ({
        title: eventTitle,
        start: date,
        className: selectedColor,
      }));

      for (const event of newEvents) {
        await addEvent({
          title: event.title,
          description: "Otomatik açıklama",
          startDate: event.start,
          endDate: event.start,
          calendarID,
        });
      }

      setEvents([...events, ...newEvents]);
      setShowEventModal(false);
      setSelectedDates([]);
      setEventTitle("");
    } catch (error) {
      console.error("Olay ekleme hatası:", error);
      alert("Olay eklenirken bir hata oluştu.");
    }
  };

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    if (!selectedDates.includes(selectedDate)) {
      setSelectedDates([...selectedDates, selectedDate]);
      setEvents([
        ...events,
        { title: "Seçilen Gün", start: selectedDate, className: "bg-secondary" },
      ]);
    }
  };

  const handleEventClick = (info) => {
    const eventDate = info.event.startStr;
    if (selectedDates.includes(eventDate)) {
      setSelectedDates(selectedDates.filter((date) => date !== eventDate));
      setEvents(
        events.filter((event) => event.start !== eventDate || event.title !== "Seçilen Gün")
      );
    }
  };

  const handleSearch = (query) => {
    const filtered = calendars.filter((calendar) =>
      calendar.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCalendars(filtered);
    setCurrentPage(1);
  };

  const paginatedCalendars = filteredCalendars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredCalendars.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="full-calendar-page">
      <Sidebar />
      <div className="main-content">
        <div className="calendar-header">
          {calendarName && <h2 className="calendar-title">{calendarName}</h2>}
          <ColorPicker handleColorSelection={setSelectedColor} />
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowEventModal(true)}
          >
            + Create New Event
          </button>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setShowCalendarModal(true)}
          >
            Takvim Seç veya Oluştur
          </button>
        </div>

        <FullCalendarWrapper
          events={events}
          handleDateClick={handleDateClick}
          handleEventClick={handleEventClick}
        />

        {showCalendarModal && (
          <CalendarModal
            calendars={calendars}
            handleSearch={handleSearch}
            paginatedCalendars={paginatedCalendars}
            handleSelectCalendar={handleSelectCalendar}
            handleCreateCalendar={createCalendar}
            currentPage={currentPage}
            handlePreviousPage={handlePreviousPage}
            handleNextPage={handleNextPage}
            calendarName={calendarName}
            setCalendarName={setCalendarName}
          />
        )}

        <EventModal
          showModal={showEventModal}
          setShowModal={setShowEventModal}
          eventTitle={eventTitle}
          setEventTitle={setEventTitle}
          selectedDates={selectedDates}
          handleAddEvent={handleAddEvent}
        />
      </div>
    </div>
  );
};

export default FullCalendarPage;
