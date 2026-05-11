using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IMaterialAssignmentRepository
    {
        Task<MaterialAssignment> AddAssignmentAsync(MaterialAssignment assignment);
        Task<IEnumerable<MaterialAssignment>> GetAssignmentsByMaterialIdAsync(int materialId);
        Task<IEnumerable<MaterialAssignment>> GetAssignmentsForUserAsync(int userId);
        Task DeleteAssignmentsByMaterialIdAsync(int materialId);
    }
}
