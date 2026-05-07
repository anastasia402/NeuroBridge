using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class TestEntityRepository : Repository<TestEntity>, ITestEntityRepository
    {
        public TestEntityRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<TestEntity?> GetByEmailAsync(string email)
        {
            return await Context.MyEntities.FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<TestEntity?> GetByIdAsync(Guid id)
        {
            return await base.GetByIdAsync(id);
        }

        public async Task DeleteByIdAsync(Guid id)
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
