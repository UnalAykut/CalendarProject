public class CreateEventDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public int CalendarID { get; set; } // Hangi takvime ekleneceği

    public String  color { get; set; }
}
