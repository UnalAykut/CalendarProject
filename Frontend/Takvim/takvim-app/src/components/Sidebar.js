import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/SidebarCss.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showCalendars, setShowCalendars] = useState(false); // "Calendars" alt menüsü için kontrol

  const handleLogout = () => {
    // Çıkış işlemleri (örneğin, auth state temizleme) buraya eklenebilir
    navigate("/"); // Home sayfasına yönlendirme
  };

  return (
    <div className="sidebar bg-dark text-white">
      <div className="logo text-center py-3">
        <h2>Hayatı Planla</h2>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a href="/admin-continue" className="nav-link text-white">
            <i className="bx bx-home-circle me-2"></i> Dashboards
          </a>
        </li>
        <li className="nav-item">
          <button
            className="btn btn-link text-white w-100 text-start"
            onClick={() => navigate("/create-calendar")}
          >
            <i className="bx bx-edit-alt me-2"></i> Takvim Oluştur
          </button>
        </li>
        <li className="nav-item">
          <button
            className="btn btn-link text-white w-100 text-start d-flex justify-content-between"
            onClick={() => setShowCalendars(!showCalendars)}
          >
            <div>
              <i className="bx bx-calendar me-2"></i> Takvimler
            </div>
            <i className={`bx ${showCalendars ? "bx-chevron-up" : "bx-chevron-down"}`}></i>
          </button>
          {showCalendars && (
            <ul className="nav flex-column ms-4">
              <li className="nav-item">
                <a
                  href="/tui-calendar"
                  className="nav-link text-white-50"
                  style={{ fontSize: "0.9rem" }}
                >
                  TUI Takvimi
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/full-calendar"
                  className="nav-link text-white"
                  style={{ fontSize: "0.9rem" }}
                >
                  Full Takvimi
                </a>
              </li>
            </ul>
          )}
        </li>
        <li className="nav-item">
          <a href="/akademik-calendar" className="nav-link text-white">
            <i className="bx bx-calendar me-2"></i> Akademik Takvim
          </a>
        </li>
        <li className="nav-item">
          <a href="/file-manager" className="nav-link text-white">
            <i className="bx bx-file me-2"></i> File Manager
          </a>
        </li>
      </ul>
      <div className="logout-button mt-auto p-3">
        <button
          className="btn btn-link text-white w-100 text-start"
          onClick={handleLogout}
        >
          <i className="bx bx-log-out me-2"></i> Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
