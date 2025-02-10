import React, { useState } from "react";
import "./HeaderEditorCss.css"
const HeaderEditor = ({ onSave }) => {
  const [mainTitle, setMainTitle] = useState("Kırklareli Üniversitesi");
  const [subTitle, setSubTitle] = useState("2024-2025 Ön Lisans ve Lisans Akademik Takvimi");

  const handleSave = () => {
    onSave(mainTitle, subTitle);
  };

  return (
    <div className="header-editor-container d-flex flex-column justify-content-center align-items-center">
      <div className="mb-3 w-50">
        <label htmlFor="mainTitle" className="form-label">
          Ana Başlık
        </label>
        <input
          id="mainTitle"
          type="text"
          className="form-control"
          value={mainTitle}
          onChange={(e) => setMainTitle(e.target.value)}
        />
      </div>
      <div className="mb-3 w-50">
        <label htmlFor="subTitle" className="form-label">
          Alt Başlık
        </label>
        <input
          id="subTitle"
          type="text"
          className="form-control"
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mt-3" onClick={handleSave}>
        Başlık Oluştur
      </button>
    </div>
  );
};

export default HeaderEditor;
