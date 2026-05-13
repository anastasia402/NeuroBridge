using Microsoft.AspNetCore.Identity;
using NeuroBridgeBackend.Entities;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        Task<IdentityResult> CreateUserAsync(User user, string password);
        Task<User?> GetByEmailAsync(string email);
        Task<IdentityResult> AddToRoleAsync(User user, string roleName);
        Task<bool> CheckPasswordAsync(User user, string password);
    }
}
