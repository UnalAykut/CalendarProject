import React from "react";
import "../css/EventModalCss.css";
const EventModal = ({
  showModal,
  setShowModal,
  eventTitle,
  setEventTitle,
  selectedDates,
  handleAddEvent,
}) => {
  if (!showModal) return null;

  return (
    <div className="event-modal-overlay">
      <div className="event-modal-dialog">
        <div className="event-modal-header">
          Yeni Olay Ekle
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
        </div>
        <div className="event-modal-body">
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
        <div className="event-modal-footer">
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
  );
};

export default EventModal;
