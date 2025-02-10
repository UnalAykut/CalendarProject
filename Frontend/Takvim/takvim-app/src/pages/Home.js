import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCalendars } from "../services/api"; // Takvimleri backend'den almak için
import "../styles/HomeCss.css";

const Home = () => {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState([]); // Tüm takvimler
  const [filteredCalendars, setFilteredCalendars] = useState([]); // Arama sonucu takvimler
  const [searchQuery, setSearchQuery] = useState(""); // Arama sorgusu
  
  // Sadece bu sayfa için body arka planını değiştir
    useEffect(() => {
      document.body.style.backgroundColor = "whitesmoke";
      document.body.style.backgroundImage = "none";
  
      return () => {
        document.body.style.backgroundColor = "";
        document.body.style.backgroundImage = "";
      };
    }, []);
  // Backend'den takvimleri getir
  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const data = await getCalendars();
        setCalendars(data);
        setFilteredCalendars(data); // Başlangıçta tüm takvimleri göster
      } catch (error) {
        console.error("Takvimler alınırken bir hata oluştu:", error);
      }
    };
    fetchCalendars();
  }, []);

  // Takvim arama işlemi
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredCalendars(calendars); // Arama boşsa tüm takvimleri göster
    } else {
      const filtered = calendars.filter((calendar) =>
        calendar.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCalendars(filtered); // Arama sonucu güncelle
    }
  };

  // Takvime Git
  const handleGoToCalendar = (calendar) => {
    navigate(`/calendar-view/${calendar.calendarID}`, { state: { calendar } });
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Takvim Sistemi</h1>
        <button className="login-button" onClick={() => navigate("/admin-login")}>
          Giriş Yap
        </button>
      </header>

      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Takvim Ara..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="calendar-list">
        <h2>Takvimler</h2>
        {filteredCalendars.length > 0 ? (
          <ul>
            {filteredCalendars.map((calendar) => (
              <li key={calendar.calendarID} className="calendar-item">
                <h3>{calendar.name}</h3>
                <p>Oluşturulma Tarihi: {new Date(calendar.createdDate).toLocaleString()}</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleGoToCalendar(calendar)}
                >
                  Takvime Git
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aramanıza uygun bir takvim bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
