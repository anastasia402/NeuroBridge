using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IUserGroupRepository
    {
        Task<UserGroup> AddAsync(UserGroup group);
        Task<IEnumerable<UserGroup>> GetAllAsync();
        Task<UserGroup?> GetByIdAsync(int id);
        Task DeleteByIdAsync(int id);
    }
}
