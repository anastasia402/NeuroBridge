using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class UserGroupService : IUserGroupService
    {
        private readonly IUserGroupRepository _userGroupRepository;

        public UserGroupService(IUserGroupRepository userGroupRepository)
        {
            _userGroupRepository = userGroupRepository;
        }

        public async Task<UserGroup> CreateUserGroupAsync(UserGroup group)
        {
            return await _userGroupRepository.AddAsync(group);
        }

        public async Task<IEnumerable<UserGroup>> GetAllUserGroupsAsync()
        {
            return await _userGroupRepository.GetAllAsync();
        }

        public async Task<UserGroup?> GetUserGroupByIdAsync(int id)
        {
            return await _userGroupRepository.GetByIdAsync(id);
        }

        public async Task DeleteUserGroupAsync(int id)
        {
            await _userGroupRepository.DeleteByIdAsync(id);
        }
    }
}
