using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IMaterialAssignmentService
    {
        Task<MaterialAssignment> AssignToUserAsync(int materialId, int userId);
        Task<MaterialAssignment> AssignToRoleAsync(int materialId, string role);
        Task<MaterialAssignment> AssignToUserGroupAsync(int materialId, int userGroupId);
        Task<IEnumerable<MaterialAssignment>> GetAssignmentsByMaterialIdAsync(int materialId);
        Task<IEnumerable<MaterialAssignment>> GetAssignmentsForUserAsync(int userId);
        Task DeleteAssignmentsByMaterialIdAsync(int materialId);
    }
}
