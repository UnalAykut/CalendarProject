public class Calendar
{
    public int CalendarID { get; set; }
    public string Name { get; set; } // Takvim adı (örneğin, "2024-2025 Akademik Takvim")
    public DateTime CreatedDate { get; set; } // Takvim oluşturulma tarihi

    // Opsiyonel: Son güncelleme tarihi
    public DateTime? ModifiedDate { get; set; }

    // Opsiyonel: Takvimi oluşturan kullanıcı
    public int? CreatedBy { get; set; }

    // Navigation Property
    public ICollection<Event> Events { get; set; }
}
