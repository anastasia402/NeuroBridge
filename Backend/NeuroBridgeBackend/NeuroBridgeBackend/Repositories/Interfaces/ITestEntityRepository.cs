using NeuroBridgeBackend.Entities;
using System.Threading.Tasks;
using NeuroBridgeBackend.Repositories.Interfaces;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface ITestEntityRepository : IRepository<TestEntity>
    {
        Task<TestEntity?> GetByEmailAsync(string email);
        Task<TestEntity?> GetByIdAsync(Guid id);
        Task DeleteByIdAsync(Guid id);
    }
}
