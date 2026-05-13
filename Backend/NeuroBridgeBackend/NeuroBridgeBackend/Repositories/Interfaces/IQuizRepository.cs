using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using NeuroBridgeBackend.Repositories.Interfaces;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IQuizRepository : IRepository<Quiz>
    {
        Task<IEnumerable<Quiz>> GetByMaterialIdAsync(int materialId);
        Task<Quiz?> GetByIdAsync(int id);
        Task DeleteByIdAsync(int id);
        Task<IEnumerable<Quiz>> GetAllWithQuestionsAsync();
        Task<Quiz?> GetWithQuestionsAsync(int id);
    }
}
