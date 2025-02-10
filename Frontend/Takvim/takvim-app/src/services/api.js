import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7057/api", // Backend API URL
});

// Giriş yapma isteği
export const login = async (email, password) => {
  try {
    const response = await API.post("/User/login", { email, password });
    return response.data; // Başarılı yanıt
  } catch (error) {
    throw error.response?.data?.message || "Giriş işlemi sırasında bir hata oluştu."; // Hata mesajı
  }
};


// Takvim oluşturma isteği
export const createCalendar = async (name) => {
  try {
    const response = await API.post("/Calendar", { name });
    return response.data; // Başarılı yanıt
  } catch (error) {
    throw error.response?.data || "Takvim oluşturulurken bir hata oluştu.";
  }
};

// Mevcut takvimleri listelemek için istek (isteğe bağlı)
export const getCalendars = async () => {
  try {
    const response = await API.get("/Calendar");
    return response.data; // Takvim listesi
  } catch (error) {
    throw error.response?.data || "Takvimler getirilirken bir hata oluştu.";
  }
};

// Olay ekleme
export const addEvent = async (eventData) => {
  try {
    const response = await API.post("/Event", eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Olay eklenirken bir hata oluştu.";
  }
};

//Takvim olayları getirme
export const getCalendarEvents = async (calendarID) => {
  const response = await fetch(`/api/calendars/${calendarID}/events`);
  return response.json();
};

// api.js

export const deleteCalendar = async (calendarID) => {
  try {
    const response = await fetch(`https://localhost:7057/api/Calendar/${calendarID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Takvim silinemedi.");
    }
  } catch (error) {
    console.error("Takvim silme hatası:", error);
    throw error;
  }
};




// Olay silme işlevi
export const deleteEvent = async (eventId) => {
  try {
    const response = await API.delete(`/Event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Olay silinirken hata oluştu:", error);
    throw error;
  }
};

// Olay güncelleme işlevi
export const updateEvent = async (eventData) => {
  try {
    const response = await API.put(`/Event/${eventData.eventID}`, {
      eventID: eventData.eventID, // ID'nin gönderildiğinden emin olun
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      color: eventData.color,
    });
    console.log("Gönderilen Veri:", {
      eventID: eventData.eventID,
      title: eventData.title,
      description: eventData.description,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      color: eventData.color,
    });
    return response.data;
  } catch (error) {
    console.error("Update Event Error:", error.response?.data || error);
    throw error;
  }
};








