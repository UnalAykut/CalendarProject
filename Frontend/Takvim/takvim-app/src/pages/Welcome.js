import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import $ from "jquery"; // jQuery'yi dahil ediyoruz
import styles from "../styles/WelcomeCss.css";

<div className={styles.welcomePage}></div>;
const Welcome = () => {
  const navigate = useNavigate();
//Bakground değiştirme
  useEffect(() => {
    // `darkBg` sınıfını body'ye ekle
    document.body.classList.add("darkBg");
    return () => {
      // Temizleme: Sınıfı kaldır
      document.body.classList.remove("darkBg");
    };
  }, []); 




  // jQuery kodunu çalıştırmak için useEffect
  useEffect(() => {
    // Ay ve gün adları
    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
    ];
    const dayNames = [
      "Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"
    ];

    // Tarih ve saati güncelleme
    function updateTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      $(".hour").html(hours);
      $(".minute").html(minutes);
      $(".second").html(seconds);

      $(".month span, .month2 span").text(monthNames[now.getMonth()]);
      $(".date span, .date2 span").text(now.getDate());
      $(".day span, .day2 span").text(dayNames[now.getDay()]);
      $(".year span").html(now.getFullYear());
    }

    // Her saniye güncellenir
    const interval = setInterval(updateTime, 1000);

    // Mousedown ve mouseup olayları
    $(".outer").on({
      mousedown: function () {
        $(".dribbble").addClass("visible");
      },
      mouseup: function () {
        $(".dribbble").removeClass("visible");
      }
    });

    // Cleanup function (useEffect'ten çıktığında temizleme)
    return () => {
      clearInterval(interval);
      $(".outer").off(); // Olay dinleyicilerini temizle
    };
  }, []); // Sadece bileşen yüklendiğinde çalışır

  // "Planlamaya Başla" butonuna tıklanınca ana sayfaya yönlendirme
  const handleStartClick = () => {
    navigate("/home");
  };

  return (
      <div className="intro anim04c">

      <div className="info anim04c">
        <li className="dribbble anim04c">
          <span>Her şey bir adımla başlar: Planlamaya hazır mısınız?</span>
        </li>
        <li className="hover anim04c">
          <span>Hayatınızı düzene sokun!</span>
        </li>
        <li className="click anim04c">
          <span>Bir tıklamayla başlamak çok kolay!</span>
        </li>
        <li className="yeaa anim04c">
          <span>- Hadi başlayalım! -</span>
        </li>
      </div>

      <div className="signboard outer">
        <div className="signboard front inner anim04c">
          <li className="year anim04c">
            <span></span>
          </li>
          <ul className="calendarMain anim04c">
            <li className="month anim04c">
              <span></span>
            </li>
            <li className="date anim04c">
              <span></span>
            </li>
            <li className="day anim04c">
              <span></span>
            </li>
          </ul>
          <li className="clock minute anim04c">
            <span></span>
          </li>
          <li className="calendarNormal date2 anim04c">
            <span></span>
          </li>
        </div>
        <div className="signboard left inner anim04c">
          <li className="clock hour anim04c">
            <span></span>
          </li>
          <li className="calendarNormal day2 anim04c">
            <span></span>
          </li>
        </div>
        <div className="signboard right inner anim04c">
          <li className="clock second anim04c">
            <span></span>
          </li>
          <li className="calendarNormal month2 anim04c">
            <span></span>
          </li>
        </div>
      </div>

      <div className="designer anim04c">
        <li>
          <button className="cta-button" onClick={handleStartClick}>
            Planlamaya Başla
          </button>
        </li>
      </div>
    </div>
  );
};

export default Welcome;
