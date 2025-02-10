using AcademicCalender.DTO;
using AcademicCalender.Entity;
using Microsoft.EntityFrameworkCore;

namespace AcademicCalender.Business;

public class UserBusiness : IUserBusiness
{
    private readonly IRepository<User> _userRepository;

    public UserBusiness(IRepository<User> userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<User> RegisterAsync(RegisterDto registerDto)
    {
        try
        {
            // E-posta kontrolü
            var existingUser = await _userRepository.FindAsync(u => u.Email == registerDto.Email);
            if (existingUser != null)
            {
                throw new Exception("Email already exists.");
            }

            // Şifre kontrolü
            if (string.IsNullOrEmpty(registerDto.Password) || registerDto.Password.Length < 6)
            {
                throw new Exception("Password must be at least 6 characters long.");
            }

            // Kullanıcı nesnesini oluştur
            var newUser = new User
            {
                Email = registerDto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(registerDto.Password), // Şifreyi hashle
                Role = "Admin" // Varsayılan olarak Admin rolü
            };

            // Kullanıcıyı veritabanına ekle
            await _userRepository.AddAsync(newUser);

            return newUser;
        }
        catch (Exception ex)
        {
            throw new Exception($"Error during registration: {ex.Message}", ex);
        }
    }
    



    public async Task<User> LoginAsync(string email, string password)
    {
        var user = (await _userRepository.GetAllAsync())
            .FirstOrDefault(u => u.Email == email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            throw new Exception("Invalid email or password.");
        }
        return user;
    }
}
