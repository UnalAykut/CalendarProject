import React from "react";

// Tarihi datetime-local input için uygun formata dönüştürme fonksiyonu
const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EditEventModal = ({
  show,
  event,
  onClose,
  onDelete,
  onSave,
  onEventChange,
}) => {
  if (!show || !event) return null;

  // Renk seçenekleri
  const colors = [
    { value: "bg-primary", label: "Mavi", colorCode: "#0d6efd" },
    { value: "bg-success", label: "Yeşil", colorCode: "#198754" },
    { value: "bg-danger", label: "Kırmızı", colorCode: "#dc3545" },
    { value: "bg-warning", label: "Sarı", colorCode: "#ffc107" },
  ];

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Olayı Düzenle</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Başlık Girişi */}
            <label>Başlık</label>
            <input
              type="text"
              className="form-control"
              value={event.title}
              onChange={(e) =>
                onEventChange({ ...event, title: e.target.value })
              }
            />

            {/* Açıklama Girişi */}
            <label className="mt-3">Açıklama</label>
            <textarea
              className="form-control"
              rows="3"
              value={event.description || ""} // Varsayılan açıklama gösterilir
              onChange={(e) =>
                onEventChange({ ...event, description: e.target.value })
              }
              placeholder="Açıklama yazınız..."
            ></textarea>

            {/* Tarih Seçimi */}
            <label className="mt-3">Başlangıç Tarihi</label>
            <input
              type="datetime-local"
              className="form-control"
              value={formatDateForInput(event.start)}
              onChange={(e) =>
                onEventChange({
                  ...event,
                  start: new Date(e.target.value).toISOString(), // Tarihi UTC formatına dönüştür
                })
              }
            />

            <label className="mt-3">Bitiş Tarihi</label>
            <input
              type="datetime-local"
              className="form-control"
              value={formatDateForInput(event.end)}
              onChange={(e) =>
                onEventChange({
                  ...event,
                  end: new Date(e.target.value).toISOString(), // Tarihi UTC formatına dönüştür
                })
              }
            />

            {/* Renk Seçimi */}
            <label className="mt-3">Renk</label>
            <div className="d-flex gap-2 mt-2">
              {colors.map((color) => (
                <div
                  key={color.value}
                  className={`color-box ${color.value} ${
                    event.className === color.value ? "selected" : ""
                  }`}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "5px",
                    backgroundColor: color.colorCode,
                    cursor: "pointer",
                    border:
                      event.className === color.value
                        ? "3px solid black"
                        : "1px solid #ccc",
                  }}
                  title={color.label}
                  onClick={() => onEventChange({ ...event, className: color.value })}
                ></div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onDelete}>
              Sil
            </button>
            <button className="btn btn-primary" onClick={onSave}>
              Kaydet
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
