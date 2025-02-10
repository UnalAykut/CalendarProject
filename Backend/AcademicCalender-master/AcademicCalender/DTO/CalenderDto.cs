public class CalendarDto
{
    public int CalendarID { get; set; } // Takvim ID'si
    public string Name { get; set; } // Takvim adı
    public DateTime CreatedDate { get; set; } // Oluşturulma tarihi
    public List<EventDto> Events { get; set; } // İlgili olaylar (isteğe bağlı)
}
