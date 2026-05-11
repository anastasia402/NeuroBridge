using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using NeuroBridgeBackend.Repositories.Interfaces;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IMaterialRepository : IRepository<Material>
    {
        Task<IEnumerable<Material>> GetByUploaderIdAsync(int uploaderId);
        Task<IEnumerable<Material>> GetAllWithAssignmentsAsync();
        Task<Material?> GetByIdAsync(int id);
        Task DeleteByIdAsync(int id);
    }
}
