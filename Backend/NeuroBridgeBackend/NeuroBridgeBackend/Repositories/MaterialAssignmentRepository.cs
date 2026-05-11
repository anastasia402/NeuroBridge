using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class MaterialAssignmentRepository : IMaterialAssignmentRepository
    {
        private readonly ApplicationDbContext _context;

        public MaterialAssignmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MaterialAssignment> AddAssignmentAsync(MaterialAssignment assignment)
        {
            await _context.MaterialAssignments.AddAsync(assignment);
            await _context.SaveChangesAsync();
            return assignment;
        }

        public async Task<IEnumerable<MaterialAssignment>> GetAssignmentsByMaterialIdAsync(int materialId)
        {
            return await _context.MaterialAssignments
                .Where(a => a.MaterialId == materialId)
                .Include(a => a.User)
                .Include(a => a.UserGroup)
                .ToListAsync();
        }

        public async Task<IEnumerable<MaterialAssignment>> GetAssignmentsForUserAsync(int userId)
        {
            return await _context.MaterialAssignments
                .Where(a => a.UserId == userId)
                .Include(a => a.Material)
                .Include(a => a.User)
                .ToListAsync();
        }

        public async Task DeleteAssignmentsByMaterialIdAsync(int materialId)
        {
            var assignments = await _context.MaterialAssignments
                .Where(a => a.MaterialId == materialId)
                .ToListAsync();

            _context.MaterialAssignments.RemoveRange(assignments);
            await _context.SaveChangesAsync();
        }
    }
}
