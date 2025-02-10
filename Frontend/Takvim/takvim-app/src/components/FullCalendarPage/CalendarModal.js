import React from "react";
import "../css/CalendarModalCss.css"
const CalendarModal = ({
  calendars,
  handleSearch,
  paginatedCalendars,
  handleSelectCalendar,
  handleCreateCalendar,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  calendarName,
  setCalendarName,
}) => {
  return (
    <div className="modal d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Takvim Seçin veya Yeni Takvim Oluşturun</h5>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Takvim Ara"
              onChange={(e) => handleSearch(e.target.value)}
            />
            <h6 className="newCalendar">Mevcut Takvimler</h6>
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
                className="btn btn-secondary next-button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Önceki
              </button>
              <button
                className="btn btn-secondary next-button"
                onClick={handleNextPage}
                disabled={currentPage * 5 >= calendars.length}
              >
                Sonraki
              </button>
            </div>
            <h6 className="mt-3 newCalendar">Yeni Takvim Oluştur</h6>
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
  );
};

export default CalendarModal;
