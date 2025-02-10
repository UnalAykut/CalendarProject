using AcademicCalender.Entity;

public class EventService : IEventService
{
    private readonly IEventRepository _eventRepository;

    public EventService(IEventRepository eventRepository)
    {
        _eventRepository = eventRepository;
    }

    public async Task<IEnumerable<Event>> GetAllEventsAsync()
    {
        return await _eventRepository.GetAllAsync();
    }

    public async Task<Event> GetEventByIdAsync(int id)
    {
        return await _eventRepository.GetByIdAsync(id);
    }

    public async Task AddEventAsync(Event eventItem)
    {
        await _eventRepository.AddAsync(eventItem);
    }

    public async Task UpdateEventAsync(Event eventItem)
    {
        await _eventRepository.UpdateAsync(eventItem);
    }

    public async Task DeleteEventAsync(int id)
    {
        await _eventRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Event>> GetEventsByCalendarIdAsync(int calendarId)
    {
        return await _eventRepository.GetEventsByCalendarIdAsync(calendarId);
    }
}
