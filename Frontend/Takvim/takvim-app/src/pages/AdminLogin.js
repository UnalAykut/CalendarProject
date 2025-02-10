import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api"; // API işlevini içe aktar
import "../styles/AdminLoginCss.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Haftanın günleri
    const weekdays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Pzr"];
    const oldDaysStart = [30, 31];
    const currentMonthDays = 31;
    const oldDaysEnd = [1, 2, 3];

    const allDays = [
      ...weekdays.map((day) => ({ text: day, className: "weekday" })),
      ...oldDaysStart.map((day) => ({ text: day, className: "old" })),
      ...Array.from({ length: currentMonthDays }, (_, i) => ({
        text: i + 1,
        className: "",
      })),
      ...oldDaysEnd.map((day) => ({ text: day, className: "old" })),
    ];

    setDays(allDays);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userData = await login(username, password); // API'den yanıt al
      console.log("Giriş başarılı:", userData);
  
      if (userData.role === "Admin") {
        navigate("/admin-continue"); // Admin paneline yönlendirme
      } else {
        alert("Bu panel yalnızca admin kullanıcıları içindir.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
  
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message); // Backend'den gelen hata mesajını göster
      } else {
        setErrorMessage("Şifre veya Kullalnıcı Adını yanlış girdiniz.");
      }
    }
  };
  

  return (
    <div className="calendar">
      <div className="base top">
        <div className="year-side"></div>
        <div className="month-side">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Admin Login</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Login</button>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </form>
        </div>
        <div className="holes">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>
      </div>
      <div className="base bottom">
        <div className="days">
          {days.map((day, index) => (
            <div key={index} className={day.className}>
              {day.text}
            </div>
          ))}
        </div>
        <div className="holes">
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
          <div className="hole"></div>
        </div>
      </div>
      <div className="rings">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
      </div>
    </div>
  );
};

export default AdminLogin;
