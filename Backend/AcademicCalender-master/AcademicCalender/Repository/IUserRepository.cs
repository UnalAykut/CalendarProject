using AcademicCalender.Entity;

namespace AcademicCalender.Repository
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User> AuthenticateAsync(string email, string password); // Giriş işlemi
        Task<bool> IsEmailExistAsync(string email); // E-posta kontrolü

    }
}
