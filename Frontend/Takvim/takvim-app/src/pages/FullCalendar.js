import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // CreateCalendar'dan gelen bilgiyi almak için
import Sidebar from "../components/Sidebar";
import CalendarModal from "../components/FullCalendarPage/CalendarModal";
import EventModal from "../components/FullCalendarPage/EventModal";
import ColorPicker from "../components/FullCalendarPage/ColorPicker";
import FullCalendarWrapper from "../components/FullCalendarPage/FullCalendarWrapper";
import EditEventModal from "../components/FullCalendarPage/EditEventModal"
import { 
  getCalendars, 
  createCalendar, 
  addEvent,
  deleteEvent,
  updateEvent,
} from "../services/api";
import "../styles/FullCalendarCss.css";
import "bootstrap/dist/css/bootstrap.min.css";
const FullCalendarPage = () => {
  const location = useLocation(); // CreateCalendar'dan gelen bilgiyi alıyoruz
  const [events, setEvents] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(true);
  const [calendarName, setCalendarName] = useState("");
  const [calendars, setCalendars] = useState([]);
  const [filteredCalendars, setFilteredCalendars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarID, setCalendarID] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [selectedColor, setSelectedColor] = useState("bg-primary");
  const [selectedEvent, setSelectedEvent] = useState(null); // Seçilen olayı saklamak için
  const [showEditEventModal, setShowEditEventModal] = useState(false); // Düzenleme modalı kontrolü
  const itemsPerPage = 5;

// Olay Düzenleme Fonksiyonu
const handleEditEvent = async () => {
  if (!selectedEvent || !selectedEvent.id) {
    console.error("Olayın ID'si eksik, güncelleme yapılamaz.", selectedEvent);
    return;
  }

  try {
    // Güncelleme için API'ye gönderilecek veri
    const updatedData = {
      eventID: selectedEvent.id,
      title: selectedEvent.title || "Varsayılan Başlık",
      color: selectedEvent.className || "bg-default",
      description: selectedEvent.description || "Varsayılan açıklama",
      startDate: selectedEvent.start || new Date().toISOString(),
      endDate: selectedEvent.end || selectedEvent.start || new Date().toISOString(),
      calendarID: selectedEvent.calendarID || 0, // Varsayılan bir değer atanabilir
    };

    // Debug için gönderilen veriyi loglama
    console.log("API'ye Gönderilen Veri:", updatedData);

    // API çağrısı
    await updateEvent(updatedData);

    // Yerel state'de güncelleme
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: updatedData.title,
              className: updatedData.color,
              description: selectedEvent.description,
              start: updatedData.startDate, // Güncellenmiş başlangıç tarihi
              end: updatedData.endDate, // Güncellenmiş bitiş tarihi
            }
          : event
      )
    );

    // Modal ve seçim sıfırlama
    setShowEditEventModal(false);
    setSelectedEvent(null);
  } catch (error) {
    // Hata yönetimi
    if (error.response) {
      console.error("Backend Hata Yanıtı:", error.response.data);
    } else {
      console.error("Bilinmeyen Hata:", error.message);
    }
  }
};







// Olay Silme Fonksiyonu
const handleDeleteEvent = async () => {
  if (!selectedEvent || !selectedEvent.id || !selectedEvent.calendarID) {
    console.error("Olay veya takvim bilgisi eksik, silme işlemi yapılamaz.");
    return;
  }

  try {
    // API'ye olay ID'si ve bağlı olduğu takvim ID'si ile silme isteği gönder
    await deleteEvent(selectedEvent.id, selectedEvent.calendarID);

    // Frontend'deki olay listesinden sil
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== selectedEvent.id)
    );

    setShowEditEventModal(false); // Düzenleme modalını kapat
    setSelectedEvent(null); // Seçili olayı sıfırla

    console.log(`Olay başarıyla silindi: ${selectedEvent.id}`);
  } catch (error) {
    console.error("Olay silinirken bir hata oluştu:", error);
  }
};




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
        console.log("Gelen Takvim Verisi:", calendarFromLocation);
        setCalendarName(calendarFromLocation.name); // Takvim adını ayarla
        setCalendarID(calendarFromLocation.calendarID); // Takvim ID'sini ayarla
        setEvents(
          calendarFromLocation.events?.map((event) => ({
            id: event.eventID,
            title: event.title,
            start: event.startDate,
            end: event.endDate || event.startDate,
            className: event.color || "bg-primary",
            description: event.description || "",
          })) || []
        );
        setShowCalendarModal(false); // Modalı kapalı tut
      }
    }, [location.state]);

  
  // Kayıtlı takvimleri getirme
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

  // Takvim seçildiğinde, olaylarla birlikte getir
  const handleSelectCalendar = async (calendarID) => {
    const selectedCalendar = calendars.find((calendar) => calendar.calendarID === calendarID);

    if (selectedCalendar) {
      setCalendarID(calendarID);
      setCalendarName(selectedCalendar.name);

      // Takvimle ilişkili olayları al
      try {
        const calendarEvents = selectedCalendar.events.map((event) => ({
          id: event.eventID,
          title: event.title,
          start: event.startDate,
          end: event.endDate || event.startDate,
          className: event.color || "bg-primary",
          description: event.description || "",
          calendarID: calendarID,
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
  console.log("Seçilen Renk:", selectedColor);
  if (!eventTitle || selectedDates.length === 0) {
    alert("Lütfen bir başlık ve en az bir tarih seçin.");
    return;
  }

  try {
    const newEvents = [];
    
    for (const date of selectedDates) {
      const response = await addEvent({
        title: eventTitle,
        description: "Otomatik açıklama",
        startDate: date,
        endDate: date,
        color: selectedColor,
        calendarID,
      });

      // Backend'den dönen yanıtı kullanarak id ekliyoruz
      newEvents.push({
        id: response.eventID,
        title: response.title,
        start: response.startDate,
        end: response.endDate || response.startDate,
        className: response.color,
        calendarID: response.calendarID,
      });
    }

    const updatedEvents = events.filter((event) => event.title !== "Seçilen Gün");
    setEvents([...updatedEvents, ...newEvents]);

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
  /* Günne olay ekleme, seçme veya seçilmiş olayı düzenleme */
  const handleEventClick = (info) => {
    console.log("Clicked Event Date:", info.event.startStr); // Tıklanan olayın tarihini kontrol edin
  
    // Tıklanan olayın `start` değerine göre mevcut olaylardan birini bul
    const clickedEvent = events.find(
      (event) =>
        event.id === info.event.id || // ID eşleşmesi
        new Date(event.start).toISOString() === new Date(info.event.startStr).toISOString() // Tarih eşleşmesi
    );
  
    // Bulunan olayı logla
    console.log("Clicked Event:", clickedEvent);
  
    // Eğer olay bulunamazsa uyarı ver
    if (!clickedEvent) {
      console.warn("Tıklanan olay bulunamadı. Belki events dizisi eksik?");
      return;
    }
  
   
    if (!clickedEvent.calendarID) {
      console.warn("Olayın takvim bilgisi eksik. Varsayılan takvim bilgisi atanıyor.");
      clickedEvent.calendarID = calendarID; // Varsayılan takvim ID'si ata
      clickedEvent.calendar = calendars.find((cal) => cal.calendarID === calendarID) || null; // Takvim bilgisi ekle
    }

    // Takvim bilgisi eksikse, mevcut takvim listesinden ekle
  if (!clickedEvent.calendar) {
    const associatedCalendar = calendars.find(
      (cal) => cal.calendarID === clickedEvent.calendarID
    );
    if (associatedCalendar) {
      clickedEvent.calendar = associatedCalendar; // Takvim bilgisini ekle
    } else {
      console.warn("Takvim bilgisi bulunamadı.");
    }
  }
  
    // Eğer tıklanan olay "Seçilen Gün" ise geçici seçimleri kaldır
    if (clickedEvent.title === "Seçilen Gün") {
      setSelectedDates(selectedDates.filter((date) => date !== info.event.startStr));
      setEvents(
        events.filter(
          (event) => event.start !== info.event.startStr || event.title !== "Seçilen Gün"
        )
      );
      console.log("Seçilen Gün kaldırıldı:", clickedEvent);
    } 
    // Mevcut bir olay tıklandıysa düzenleme modalını aç
    else if (clickedEvent) {
      setSelectedEvent(clickedEvent); // Seçili olayı kaydet
      setShowEditEventModal(true); // Düzenleme modalını aç
      console.log("Düzenleme modalı açılıyor:", clickedEvent);
    } 
  };
  


  
  

  // Takvim arama
  const handleSearch = (query) => {
    const filtered = calendars.filter((calendar) =>
      calendar.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCalendars(filtered);
    setCurrentPage(1);
  };

  // Sayfalama
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

  const handleCreateCalendar = async () => {
    if (!calendarName) {
      alert("Lütfen bir takvim ismi girin.");
      return;
    }
  
    try {
      const calendar = await createCalendar(calendarName); // Yeni takvim oluştur
      setCalendarID(calendar.calendarID); // Takvim ID'sini kaydet
      setCalendarName(calendar.name); // Takvim adını güncelle
      setCalendars([...calendars, calendar]); // Mevcut takvim listesine ekle
      setShowCalendarModal(false); // Modalı kapat
  
      // Yeni takvim için olayları sıfırla (opsiyonel)
      setEvents([]);
    } catch (error) {
      console.error("Takvim oluşturulurken bir hata oluştu:", error);
    }
  };
  



  return (
    <div className="full-calendar-page">
      <Sidebar />

      <div className="main-content">
        <div className="calendar-header">
          {calendarName && <h2 className="calendar-title">{calendarName}</h2>}
          <ColorPicker className="custom-color-picker" handleColorSelection={setSelectedColor} />
          <div className="button-container">
          <button
            className="btn btn-primary mt-3"
            onClick={() => setShowEventModal(true)}
          >
            + Yeni Etkinlik Oluştur
          </button>
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setShowCalendarModal(true)} // Modalı açmak için
          >
            Takvim Seç veya Oluştur
          </button>
          </div>
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
            handleCreateCalendar={handleCreateCalendar}
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
        <EditEventModal
          show={showEditEventModal}
          event={selectedEvent}
          onClose={() => setShowEditEventModal(false)}
          onDelete={handleDeleteEvent}
          onSave={handleEditEvent}
          onEventChange={setSelectedEvent}
        />  

      </div>
    </div>
  );
};

export default FullCalendarPage;
