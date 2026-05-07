using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        public UserRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await Context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await base.GetByIdAsync(id);
        }

        public async Task DeleteByIdAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                Delete(entity);
                await SaveChangesAsync();
            }
        }
    }
}
