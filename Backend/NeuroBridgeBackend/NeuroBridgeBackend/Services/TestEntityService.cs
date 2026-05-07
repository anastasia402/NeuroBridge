using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class TestEntityService : ITestEntityService
    {
        private readonly ITestEntityRepository _testEntityRepository;

        public TestEntityService(ITestEntityRepository testEntityRepository)
        {
            _testEntityRepository = testEntityRepository;
        }

        public async Task<IEnumerable<TestEntity>> GetAllTestEntitiesAsync()
        {
            return await _testEntityRepository.GetAllAsync();
        }

        public async Task<TestEntity?> GetTestEntityByIdAsync(Guid id)
        {
            return await _testEntityRepository.GetByIdAsync(id);
        }

        public async Task<TestEntity?> GetTestEntityByEmailAsync(string email)
        {
            return await _testEntityRepository.GetByEmailAsync(email);
        }

        public async Task CreateTestEntityAsync(TestEntity testEntity)
        {
            await _testEntityRepository.AddAsync(testEntity);
            await _testEntityRepository.SaveChangesAsync();
        }

        public async Task UpdateTestEntityAsync(TestEntity testEntity)
        {
            _testEntityRepository.Update(testEntity);
            await _testEntityRepository.SaveChangesAsync();
        }

        public async Task DeleteTestEntityAsync(Guid id)
        {
            await _testEntityRepository.DeleteByIdAsync(id);
        }
    }
}
