public class Event
{
    public int EventID { get; set; }
    public string Title { get; set; }
    public string Description { get; set; } // Etkinlik açıklaması
    public string color { get; set; }
    public DateTime StartDate { get; set; } // Olay başlangıç tarihi
    public DateTime EndDate { get; set; } // Olay bitiş tarihi

    // Foreign Key
    public int CalendarID { get; set; }
    public Calendar Calendar { get; set; }

    
}
