using AcademicCalender.Entity;
using AcademicCalender.Repository;
using Microsoft.EntityFrameworkCore;

public class EventRepository : Repository<Event>, IEventRepository
{
    private readonly ApplicationDbContext _context;

    public EventRepository(ApplicationDbContext context) : base(context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Event>> GetEventsByCalendarIdAsync(int calendarId)
    {
        return await _context.Events
            .Where(e => e.CalendarID == calendarId)
            .ToListAsync();
    }
}
