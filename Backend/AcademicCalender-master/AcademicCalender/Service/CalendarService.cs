public class CalendarService : ICalendarService
{
    private readonly IRepository<Calendar> _calendarRepository;

    public CalendarService(IRepository<Calendar> calendarRepository)
    {
        _calendarRepository = calendarRepository;
    }

    public async Task<IEnumerable<Calendar>> GetAllCalendarsAsync()
    {
        return await _calendarRepository.GetAllAsync(null, c => c.Events);
    }

    public async Task<Calendar> GetCalendarByIdAsync(int id)
    {
        return await _calendarRepository.GetAsync(c => c.CalendarID == id, c => c.Events);
    }


    public async Task AddCalendarAsync(Calendar calendar)
    {
        calendar.CreatedDate = DateTime.UtcNow; // Varsayılan olarak oluşturulma tarihi ekle
        await _calendarRepository.AddAsync(calendar);
    }

    public async Task UpdateCalendarAsync(Calendar calendar)
    {
        await _calendarRepository.UpdateAsync(calendar);
    }

    public async Task DeleteCalendarAsync(int id)
    {
        await _calendarRepository.DeleteAsync(id);
    }
}
