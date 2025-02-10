import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCalendar, getCalendars, deleteCalendar } from "../services/api"; // deleteCalendar eklendi
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CreateCalendarCss.css";

const CreateCalendar = () => {
  const [calendars, setCalendars] = useState([]); // Tüm takvimler
  const [filteredCalendars, setFilteredCalendars] = useState([]); // Filtrelenmiş takvimler
  const [showModal, setShowModal] = useState(false); // Yeni takvim oluşturma modalı
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Silme onay modalı
  const [newCalendarName, setNewCalendarName] = useState(""); // Yeni takvim adı
  const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu
  const [calendarToDelete, setCalendarToDelete] = useState(null); // Silinecek takvim
  const navigate = useNavigate();

  // Tüm takvimleri backend'den getir
  const fetchCalendars = async () => {
    try {
      const data = await getCalendars();
      setCalendars(data);
      setFilteredCalendars(data); // Filtrelenen takvimleri başta tüm takvimlerle eşleştir
    } catch (error) {
      console.error("Takvimler alınırken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    document.body.style.backgroundColor = "#f8f9fa";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  useEffect(() => {
    fetchCalendars();
  }, []);

  // Yeni takvim oluşturma
  const handleCreateCalendar = async () => {
    if (!newCalendarName.trim()) {
      alert("Lütfen bir takvim adı girin.");
      return;
    }

    try {
      const newCalendar = await createCalendar(newCalendarName);
      setCalendars([...calendars, newCalendar]);
      setFilteredCalendars([...filteredCalendars, newCalendar]); // Filtreyi güncelle
      setShowModal(false);
      setNewCalendarName("");
    } catch (error) {
      console.error("Takvim oluşturma hatası:", error);
    }
  };

  // Takvim silme işlemi
  const handleDeleteCalendar = async () => {
    try {
      if (calendarToDelete) {
        await deleteCalendar(calendarToDelete.calendarID); // Backend'den sil
        setCalendars(calendars.filter((cal) => cal.calendarID !== calendarToDelete.calendarID)); // Listeyi güncelle
        setFilteredCalendars(
          filteredCalendars.filter((cal) => cal.calendarID !== calendarToDelete.calendarID)
        ); // Filtreyi güncelle
        setCalendarToDelete(null); // Silinecek takvimi sıfırla
        setShowDeleteModal(false); // Modalı kapat
      }
    } catch (error) {
      alert("Takvim silinirken bir hata oluştu.");
    }
  };

  // Takvime Git
  const handleGoToCalendar = (calendar) => {
    navigate(`/calendar/${calendar.calendarID}`, { state: { calendar } });
  };

  // Arama işlemi
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCalendars(calendars); // Arama boşsa tüm takvimleri göster
    } else {
      const filtered = calendars.filter((cal) =>
        cal.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCalendars(filtered); // Arama sonucu takvimleri güncelle
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <div className="page-header d-flex justify-content-between align-items-center">
          <h1 className="text-center">Takvim Yönetimi</h1>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Takvim Ara..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)} // Arama işlevi
          />
        </div>
        <div className="calendar-list">
          <h2>Oluşturulan Takvimler</h2>
          <ul className="list-group">
            {filteredCalendars.length > 0 ? (
              filteredCalendars.map((calendar) => (
                <li
                  key={calendar.calendarID}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    {calendar.name} -{" "}
                    {new Date(calendar.createdDate).toLocaleString()}
                  </span>
                  <div>
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => handleGoToCalendar(calendar)} // Takvime git
                    >
                      Takvime Git
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setCalendarToDelete(calendar); // Silinecek takvimi ata
                        setShowDeleteModal(true); // Silme onay modalını aç
                      }}
                    >
                      Takvim Sil
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <li className="list-group-item">
                Aramanıza uygun bir takvim bulunamadı.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Takvim Oluştur Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Yeni Takvim Oluştur</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Takvim Adı</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCalendarName}
                    onChange={(e) => setNewCalendarName(e.target.value)}
                  />
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
                  onClick={handleCreateCalendar}
                >
                  Oluştur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Takvim Sil Onay Modal */}
      {showDeleteModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Takvim Sil</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  "{calendarToDelete?.name}" takvimini silmek istediğinizden emin
                  misiniz?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Hayır
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteCalendar}
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCalendar;
