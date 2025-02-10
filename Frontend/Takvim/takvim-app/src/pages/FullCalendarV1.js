import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Sidebar from "../components/Sidebar";
import { createCalendar, getCalendars, addEvent } from "../services/api"; // Takvim oluşturma ve listeleme API'leri
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/FullCalendarCss.css";

const FullCalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]); // Seçilen günler
  const [showModal, setShowModal] = useState(false); // Olay ekleme modal kontrolü
  const [calendarModal, setCalendarModal] = useState(true); // Takvim seçim modal kontrolü
  const [calendarName, setCalendarName] = useState(""); // Yeni takvim ismi
  const [calendars, setCalendars] = useState([]); // Kayıtlı takvimler
  const [calendarID, setCalendarID] = useState(null); // Seçilen veya yeni oluşturulan CalendarID
  const [eventTitle, setEventTitle] = useState(""); // Yeni olay başlığı
  const [selectedColor, setSelectedColor] = useState("bg-primary"); // Seçilen renk
  const [filteredCalendars, setFilteredCalendars] = useState([]); // Arama için filtrelenmiş takvimler
  const [currentPage, setCurrentPage] = useState(1); // Sayfalama için mevcut sayfa
  const itemsPerPage = 5; // Her sayfada gösterilecek takvim sayısı
  
  // Sadece bu sayfa için body arka planını değiştir
  useEffect(() => {
    document.body.style.backgroundColor = "whitesmoke";
    document.body.style.backgroundImage = "none";

    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.backgroundImage = "";
    };
  }, []);

   // Kayıtlı takvimleri backend'den al
   useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const data = await getCalendars();
        setCalendars(data);
        setFilteredCalendars(data);
      } catch (error) {
        console.error("Kayıtlı takvimler alınırken bir hata oluştu:", error);
      }
    };

    fetchCalendars();
  }, []);

// Takvim arama
const handleSearch = (query) => {
    const filtered = calendars.filter((calendar) =>
      calendar.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCalendars(filtered);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  // Sayfalama
  const paginatedCalendars = filteredCalendars.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredCalendars.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  // Kayıtlı takvimleri backend'den al
  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const data = await getCalendars();
        setCalendars(data);
      } catch (error) {
        console.error("Kayıtlı takvimler alınırken bir hata oluştu:", error);
      }
    };

    fetchCalendars();
  }, []);

  // Yeni takvim oluşturma
  const handleCreateCalendar = async () => {
    if (!calendarName) {
      alert("Lütfen bir takvim ismi girin.");
      return;
    }
    try {
      const calendar = await createCalendar(calendarName);
      setCalendarID(calendar.calendarID); // CalendarID'yi kaydet
      setCalendarModal(false); // Modalı kapat
    } catch (error) {
      console.error("Takvim oluşturulurken bir hata oluştu:", error);
      alert("Takvim oluşturulamadı.");
    }
  };

  // Mevcut bir takvim seçme
  const handleSelectCalendar = (id) => {
    setCalendarID(id); // Seçilen CalendarID'yi kaydet
    setCalendarModal(false); // Modalı kapat
  };

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    if (!selectedDates.includes(selectedDate)) {
      setSelectedDates([...selectedDates, selectedDate]);

      // Takvimde anlık olarak seçilen tarihleri göster
      setEvents([
        ...events,
        { title: "Seçilen Gün", start: selectedDate, className: "bg-secondary" },
      ]);
    }
  };

  const handleEventClick = (info) => {
    const eventDate = info.event.startStr;

    // Seçilen tarihi kaldır
    if (selectedDates.includes(eventDate)) {
      setSelectedDates(selectedDates.filter((date) => date !== eventDate));

      // Takvimdeki olayları kaldır
      setEvents(events.filter((event) => event.start !== eventDate || event.title !== "Seçilen Gün"));
    }
  };

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

      const updatedEvents = events.filter((event) => event.title !== "Seçilen Gün");
      setEvents([...updatedEvents, ...newEvents]);

      setShowModal(false);
      setSelectedDates([]);
      setEventTitle("");
    } catch (error) {
      console.error("Olay ekleme hatası:", error);
      alert("Olay eklenirken bir hata oluştu.");
    }
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color); // Seçilen rengi güncelle
  };

  return (
    <div className="full-calendar-page">
      <Sidebar />
      <div className="main-content">
        <div className="calendar-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <button
                className="btn btn-success me-2"
                onClick={() => handleColorSelection("bg-success")}
              >
                New Event Planning
              </button>
              <button
                className="btn btn-info me-2"
                onClick={() => handleColorSelection("bg-info")}
              >
                Meeting
              </button>
              <button
                className="btn btn-warning me-2"
                onClick={() => handleColorSelection("bg-warning")}
              >
                Generating Reports
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleColorSelection("bg-danger")}
              >
                Create New Theme
              </button>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowModal(true)}
            >
              + Create New Event
            </button>
          </div>
          <p className="mt-3 text-muted">
            Bir tarih seçin ve seçilen renkte bir olay oluşturun.
          </p>
        </div>
         {/* Calendar Modal */}
         {calendarModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Takvim Seçin veya Yeni Takvim Oluşturun
                  </h5>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Takvim Ara"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <h6>Mevcut Takvimler</h6>
                  <ul>
                    {paginatedCalendars.map((calendar) => (
                      <li key={calendar.calendarID} className="mb-2">
                        <button
                          className="btn btn-outline-primary w-100"
                          onClick={() => handleSelectCalendar(calendar.calendarID)}
                        >
                          {calendar.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-secondary"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Önceki
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleNextPage}
                      disabled={
                        currentPage * itemsPerPage >= filteredCalendars.length
                      }
                    >
                      Sonraki
                    </button>
                  </div>
                  <h6 className="mt-3">Yeni Takvim Oluştur</h6>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Takvim İsmi"
                    value={calendarName}
                    onChange={(e) => setCalendarName(e.target.value)}
                  />
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleCreateCalendar}
                  >
                    Takvim Oluştur
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick} // Olay üzerine tıklama
            locale="en"
          />
        </div>
      </div>

      {/* Olay Ekle Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Yeni Olay Ekle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Olay Başlığı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <h6>Seçilen Tarihler:</h6>
                  {selectedDates.length > 0 ? (
                    <ul>
                      {selectedDates.map((date, index) => (
                        <li key={index}>{date}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Henüz bir tarih seçilmedi.</p>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Kapat
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAddEvent}
                >
                  Olay Ekle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

</div>
  );
};

export default FullCalendarPage; 