using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CalendarController : ControllerBase
{
    private readonly ICalendarService _calendarService;

    public CalendarController(ICalendarService calendarService)
    {
        _calendarService = calendarService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCalendars()
    {
        var calendars = await _calendarService.GetAllCalendarsAsync();

        if (calendars == null || !calendars.Any())
        {
            return NotFound("No calendars found.");
        }

        var calendarDtos = calendars.Select(c => new CalendarDto
        {
            CalendarID = c.CalendarID,
            Name = c.Name,
            CreatedDate = c.CreatedDate,
            Events = c.Events?.Select(e => new EventDto
            {
                EventID = e.EventID,
                Title = e.Title,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                color= e.color
            }).ToList() ?? new List<EventDto>()
        }).ToList();

        return Ok(calendarDtos);
    }



    [HttpGet("{id}")]
    public async Task<IActionResult> GetCalendarById(int id)
    {
        var calendar = await _calendarService.GetCalendarByIdAsync(id);

        if (calendar == null)
        {
            return NotFound($"Calendar with ID {id} not found.");
        }

        var calendarDto = new CalendarDto
        {
            CalendarID = calendar.CalendarID,
            Name = calendar.Name,
            CreatedDate = calendar.CreatedDate,
            Events = calendar.Events?.Select(e => new EventDto
            {
                EventID = e.EventID,
                Title = e.Title,
                Description = e.Description,
                StartDate = e.StartDate,
                EndDate = e.EndDate,
                color=e.color
            }).ToList() ?? new List<EventDto>()
        };

        return Ok(calendarDto);
    }


    [HttpPost]
    public async Task<IActionResult> CreateCalendar([FromBody] CreateCalendarDto createCalendarDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var calendar = new Calendar
        {
            Name = createCalendarDto.Name,
            CreatedDate = DateTime.UtcNow
        };

        await _calendarService.AddCalendarAsync(calendar);
        return CreatedAtAction(nameof(GetAllCalendars), new { id = calendar.CalendarID }, calendar);
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCalendar(int id, [FromBody] Calendar calendar)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        if (id != calendar.CalendarID) return BadRequest("ID uyuşmazlığı");
        await _calendarService.UpdateCalendarAsync(calendar);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCalendar(int id)
    {
        await _calendarService.DeleteCalendarAsync(id);
        return NoContent();
    }
}
