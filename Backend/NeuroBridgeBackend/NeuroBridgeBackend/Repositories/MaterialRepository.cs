using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class MaterialRepository : Repository<Material>, IMaterialRepository
    {
        public MaterialRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<Material>> GetByUploaderIdAsync(int uploaderId)
        {
            return await Context.Materials
                .Where(m => m.UploaderId == uploaderId)
                .Include(m => m.Assignments)
                    .ThenInclude(a => a.User)
                .ToListAsync();
        }

        public async Task<IEnumerable<Material>> GetAllWithAssignmentsAsync()
        {
            return await Context.Materials
                .Include(m => m.Assignments)
                    .ThenInclude(a => a.User)
                .ToListAsync();
        }

        public async Task<Material?> GetByIdAsync(int id)
        {
            return await Context.Materials
                .Include(m => m.Assignments)
                    .ThenInclude(a => a.User)
                .FirstOrDefaultAsync(m => m.Id == id);
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
