using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class MaterialService : IMaterialService
    {
        private readonly IMaterialRepository _materialRepository;

        public MaterialService(IMaterialRepository materialRepository)
        {
            _materialRepository = materialRepository;
        }

        public async Task<IEnumerable<Material>> GetAllMaterialsAsync()
        {
            return await _materialRepository.GetAllAsync();
        }

        public async Task<IEnumerable<Material>> GetAllMaterialsWithAssignmentsAsync()
        {
            return await _materialRepository.GetAllWithAssignmentsAsync();
        }

        public async Task<Material?> GetMaterialByIdAsync(int id)
        {
            return await _materialRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Material>> GetMaterialsByUploaderIdAsync(int uploaderId)
        {
            return await _materialRepository.GetByUploaderIdAsync(uploaderId);
        }

        public async Task CreateMaterialAsync(Material material)
        {
            await _materialRepository.AddAsync(material);
            await _materialRepository.SaveChangesAsync();
        }

        public async Task UpdateMaterialAsync(Material material)
        {
            _materialRepository.Update(material);
            await _materialRepository.SaveChangesAsync();
        }

        public async Task DeleteMaterialAsync(int id)
        {
            await _materialRepository.DeleteByIdAsync(id);
        }
    }
}
