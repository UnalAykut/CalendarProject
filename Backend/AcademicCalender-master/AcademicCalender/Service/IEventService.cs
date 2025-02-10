using AcademicCalender.Entity;

public interface IEventService
{
    Task<IEnumerable<Event>> GetAllEventsAsync();
    Task<Event> GetEventByIdAsync(int id);
    Task AddEventAsync(Event eventItem);
    Task UpdateEventAsync(Event eventItem);
    Task DeleteEventAsync(int id);
    Task<IEnumerable<Event>> GetEventsByCalendarIdAsync(int calendarId);
}
