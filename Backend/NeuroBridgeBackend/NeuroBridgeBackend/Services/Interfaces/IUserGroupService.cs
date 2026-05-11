using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IUserGroupService
    {
        Task<UserGroup> CreateUserGroupAsync(UserGroup group);
        Task<IEnumerable<UserGroup>> GetAllUserGroupsAsync();
        Task<UserGroup?> GetUserGroupByIdAsync(int id);
        Task DeleteUserGroupAsync(int id);
    }
}
