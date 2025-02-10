using AcademicCalender.Entity;

public interface IEventRepository : IRepository<Event>
{
    Task<IEnumerable<Event>> GetEventsByCalendarIdAsync(int calendarId);
}
