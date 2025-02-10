using AcademicCalender.Entity;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace AcademicCalender.Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context) : base(context) { }

        public async Task<User> AuthenticateAsync(string email, string password)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == email && u.Password == password);
        }

        public async Task<bool> IsEmailExistAsync(string email)
        {
            return await _dbSet.AnyAsync(u => u.Email == email);
        }
    }
}
