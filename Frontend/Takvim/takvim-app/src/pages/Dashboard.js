import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCalendar, getCalendars } from "../services/api";
import Sidebar from "../components/Sidebar"; // Sidebar bileşenini dahil ediyoruz
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/DashboardCss.css";

const Dashboard = () => {
  const [calendars, setCalendars] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCalendarName, setNewCalendarName] = useState("");
  const navigate = useNavigate();

  const fetchCalendars = async () => {
    try {
      const data = await getCalendars();
      setCalendars(data);
    } catch (error) {
      console.error("Takvimler alınırken bir hata oluştu:", error);
    }
  };

  useEffect(() => {
    fetchCalendars();
  }, []);

  const handleCreateCalendar = async () => {
    try {
      const newCalendar = await createCalendar(newCalendarName);
      setCalendars([...calendars, newCalendar]);
      setShowModal(false);
      setNewCalendarName("");
    } catch (error) {
      console.error("Takvim oluşturma hatası:", error);
    }
  };

  useEffect(() => {
    // Bu sayfa için arka plan rengini ayarla
    document.body.style.background = "whitesmoke";

    // Sayfadan çıkıldığında eski duruma döndür
    return () => {
      document.body.style.background = "";
    };
  }, []);

  const handleGoToCalendar = (calendar) => {
    navigate(`/calendar/${calendar.calendarID}`, { state: { calendar } });
  };

  return (
    <div className="dashboard">
      <Sidebar onOpenCreateModal={() => setShowModal(true)} /> {/* Takvim Oluştur için fonksiyon */}
      <div className="main-content">
        <div className="page-header">
          <h1 className="text-center">Takvim Yönetimi</h1>
        </div>
        <div className="calendar-list">
          <h2>Oluşturulan Takvimler</h2>
          <ul className="list-group">
            {calendars.length > 0 ? (
              calendars.map((calendar) => (
                <li key={calendar.calendarID} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    {calendar.name} -{" "}
                    {new Date(calendar.createdDate).toLocaleString()}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleGoToCalendar(calendar)}
                  >
                    Takvime Git
                  </button>
                </li>
              ))
            ) : (
              <li className="list-group-item">Henüz oluşturulmuş bir takvim yok.</li>
            )}
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Yeni Takvim Oluştur</h5>
                <button
                  type="button"
                  className="close btn btn-danger"
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
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
    </div>
  );
};

export default Dashboard;
