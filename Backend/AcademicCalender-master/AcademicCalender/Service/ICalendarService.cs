public interface ICalendarService
{
    Task<IEnumerable<Calendar>> GetAllCalendarsAsync();
    Task<Calendar> GetCalendarByIdAsync(int id);
    Task AddCalendarAsync(Calendar calendar);
    Task UpdateCalendarAsync(Calendar calendar);
    Task DeleteCalendarAsync(int id);
}
