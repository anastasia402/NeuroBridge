using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class UserGroupRepository : IUserGroupRepository
    {
        private readonly ApplicationDbContext _context;

        public UserGroupRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserGroup> AddAsync(UserGroup group)
        {
            await _context.UserGroups.AddAsync(group);
            await _context.SaveChangesAsync();
            return group;
        }

        public async Task<IEnumerable<UserGroup>> GetAllAsync()
        {
            return await _context.UserGroups
                .OrderBy(g => g.Name)
                .ToListAsync();
        }

        public async Task<UserGroup?> GetByIdAsync(int id)
        {
            return await _context.UserGroups.FindAsync(id);
        }

        public async Task DeleteByIdAsync(int id)
        {
            var group = await GetByIdAsync(id);
            if (group == null)
                throw new KeyNotFoundException("User group not found");

            _context.UserGroups.Remove(group);
            await _context.SaveChangesAsync();
        }
    }
}
