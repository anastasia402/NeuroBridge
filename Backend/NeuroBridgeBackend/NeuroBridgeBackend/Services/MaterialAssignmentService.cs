using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class MaterialAssignmentService : IMaterialAssignmentService
    {
        private readonly IMaterialAssignmentRepository _materialAssignmentRepository;
        private readonly IMaterialRepository _materialRepository;

        public MaterialAssignmentService(
            IMaterialAssignmentRepository materialAssignmentRepository,
            IMaterialRepository materialRepository)
        {
            _materialAssignmentRepository = materialAssignmentRepository;
            _materialRepository = materialRepository;
        }

        public async Task<MaterialAssignment> AssignToUserAsync(int materialId, int userId)
        {
            var material = await _materialRepository.GetByIdAsync(materialId);
            if (material == null)
                throw new KeyNotFoundException("Material not found");

            var assignment = new MaterialAssignment
            {
                MaterialId = materialId,
                UserId = userId
            };

            return await _materialAssignmentRepository.AddAssignmentAsync(assignment);
        }

        public async Task<MaterialAssignment> AssignToRoleAsync(int materialId, string role)
        {
            var material = await _materialRepository.GetByIdAsync(materialId);
            if (material == null)
                throw new KeyNotFoundException("Material not found");

            if (string.IsNullOrWhiteSpace(role))
                throw new ArgumentException("Assigned role is required", nameof(role));

            var assignment = new MaterialAssignment
            {
                MaterialId = materialId,
                AssignedRole = role.Trim().ToUpperInvariant()
            };

            return await _materialAssignmentRepository.AddAssignmentAsync(assignment);
        }

        public async Task<MaterialAssignment> AssignToUserGroupAsync(int materialId, int userGroupId)
        {
            var material = await _materialRepository.GetByIdAsync(materialId);
            if (material == null)
                throw new KeyNotFoundException("Material not found");

            var assignment = new MaterialAssignment
            {
                MaterialId = materialId,
                UserGroupId = userGroupId
            };

            return await _materialAssignmentRepository.AddAssignmentAsync(assignment);
        }

        public async Task<IEnumerable<MaterialAssignment>> GetAssignmentsByMaterialIdAsync(int materialId)
        {
            return await _materialAssignmentRepository.GetAssignmentsByMaterialIdAsync(materialId);
        }

        public async Task<IEnumerable<MaterialAssignment>> GetAssignmentsForUserAsync(int userId)
        {
            return await _materialAssignmentRepository.GetAssignmentsForUserAsync(userId);
        }

        public async Task DeleteAssignmentsByMaterialIdAsync(int materialId)
        {
            await _materialAssignmentRepository.DeleteAssignmentsByMaterialIdAsync(materialId);
        }
    }
}
