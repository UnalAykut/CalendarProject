using AcademicCalender.DTO;
using AcademicCalender.Entity;

public interface IUserService
{
    Task<User> RegisterAsync(RegisterDto registerDto);
    Task<User> LoginAsync(string email, string password);
}
