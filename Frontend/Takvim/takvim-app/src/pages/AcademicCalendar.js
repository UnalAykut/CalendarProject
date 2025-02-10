import React, { useState ,useEffect} from "react";
import HeaderEditor from "../components/AcademicCalendarPage/HeaderEditor";
import TableEditor from "../components/AcademicCalendarPage/TableEditor";

const AcademicCalendar = () => {
  const [mainTitle, setMainTitle] = useState("Kırklareli Üniversitesi");
  const [subTitle, setSubTitle] = useState("2024-2025 Ön Lisans ve Lisans Akademik Takvimi");

     // Sadece bu sayfa için body arka planını değiştir
        useEffect(() => {
          document.body.style.backgroundColor = "whitesmoke";
          document.body.style.backgroundImage = "none";
      
          return () => {
            document.body.style.backgroundColor = "";
            document.body.style.backgroundImage = "";
          };
        }, []);

  const handleHeaderSave = (newMainTitle, newSubTitle) => {
    setMainTitle(newMainTitle);
    setSubTitle(newSubTitle);
  };

  return (
    <div>
      <HeaderEditor onSave={handleHeaderSave} />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h1>{mainTitle}</h1>
        <h2>{subTitle}</h2>
      </div>
      <TableEditor />
    </div>
  );
};

export default AcademicCalendar;
