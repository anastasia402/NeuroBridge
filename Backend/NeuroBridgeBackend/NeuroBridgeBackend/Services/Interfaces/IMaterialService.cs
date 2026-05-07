using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IMaterialService
    {
        Task<IEnumerable<Material>> GetAllMaterialsAsync();
        Task<Material?> GetMaterialByIdAsync(int id);
        Task<IEnumerable<Material>> GetMaterialsByUploaderIdAsync(int uploaderId);
        Task CreateMaterialAsync(Material material);
        Task UpdateMaterialAsync(Material material);
        Task DeleteMaterialAsync(int id);
    }
}
