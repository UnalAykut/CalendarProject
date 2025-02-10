using AcademicCalender.DTO;
using AcademicCalender.Entity;
namespace AcademicCalender.Business;

public interface IUserBusiness
{
    Task<User> RegisterAsync(RegisterDto registerDto);
    Task<User> LoginAsync(string email, string password);
}
