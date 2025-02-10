import React, { useState } from "react";
import "../css/ColorPickerCss.css";

const ColorPicker = ({ handleColorSelection }) => {
  const [selectedButton, setSelectedButton] = useState(null); // Seçili buton
  const [hoveredButton, setHoveredButton] = useState(null); // Hover edilen buton

  const handleHover = (buttonId) => {
    setHoveredButton(buttonId); // Hover edilen butonu kaydet
  };

  const handleHoverOut = () => {
    setHoveredButton(null); // Hover durumu kaldırıldığında sıfırla
  };

  const handleClick = (color, buttonId) => {
    if (selectedButton === buttonId) {
      // Eğer tıklanan buton zaten seçiliyse seçimi iptal et
      setSelectedButton(null);
      handleColorSelection(null); // Renk seçimini iptal et
    } else {
      // Yeni butonu seçili yap
      setSelectedButton(buttonId);
      handleColorSelection(color);
    }
  };

  return (
    <div className="color-picker-container">
      <button
        className={`btn btn-success ${
          selectedButton === "planning"
            ? "selected"
            : selectedButton
            ? "shrink"
            : hoveredButton && hoveredButton !== "planning"
            ? "shrink"
            : ""
        }`}
        onClick={() => handleClick("bg-success", "planning")}
        onMouseEnter={() => handleHover("planning")}
        onMouseLeave={handleHoverOut}
      >
        Yeni Etkinlik Planlama
      </button>
      <button
        className={`btn btn-info ${
          selectedButton === "meeting"
            ? "selected"
            : selectedButton
            ? "shrink"
            : hoveredButton && hoveredButton !== "meeting"
            ? "shrink"
            : ""
        }`}
        onClick={() => handleClick("bg-info", "meeting")}
        onMouseEnter={() => handleHover("meeting")}
        onMouseLeave={handleHoverOut}
      >
        Toplantı
      </button>
      <button
        className={`btn btn-warning ${
          selectedButton === "report"
            ? "selected"
            : selectedButton
            ? "shrink"
            : hoveredButton && hoveredButton !== "report"
            ? "shrink"
            : ""
        }`}
        onClick={() => handleClick("bg-warning", "report")}
        onMouseEnter={() => handleHover("report")}
        onMouseLeave={handleHoverOut}
      >
        Rapor Oluşturma
      </button>
      <button
        className={`btn btn-danger ${
          selectedButton === "theme"
            ? "selected"
            : selectedButton
            ? "shrink"
            : hoveredButton && hoveredButton !== "theme"
            ? "shrink"
            : ""
        }`}
        onClick={() => handleClick("bg-danger", "theme")}
        onMouseEnter={() => handleHover("theme")}
        onMouseLeave={handleHoverOut}
      >
        Yeni Tema Oluştur
      </button>
    </div>
  );
};

export default ColorPicker;
