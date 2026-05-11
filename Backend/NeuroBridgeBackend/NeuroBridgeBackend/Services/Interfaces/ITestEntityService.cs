using NeuroBridgeBackend.Entities;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface ITestEntityService
    {
        Task<IEnumerable<TestEntity>> GetAllTestEntitiesAsync();
        Task<TestEntity?> GetTestEntityByIdAsync(Guid id);
        Task<TestEntity?> GetTestEntityByEmailAsync(string email);
        Task CreateTestEntityAsync(TestEntity testEntity);
        Task UpdateTestEntityAsync(TestEntity testEntity);
        Task DeleteTestEntityAsync(Guid id);
    }
}
