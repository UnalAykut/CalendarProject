using AcademicCalender.Business;
using AcademicCalender.DTO;
using AcademicCalender.Entity;

public class UserService : IUserService
{
    private readonly IUserBusiness _userBusiness;

    public UserService(IUserBusiness userBusiness)
    {
        _userBusiness = userBusiness;
    }

    public async Task<User> RegisterAsync(RegisterDto registerDto)
    {
        return await _userBusiness.RegisterAsync(registerDto);
    }

    public async Task<User> LoginAsync(string email, string password)
    {
        return await _userBusiness.LoginAsync(email, password);
    }
}
