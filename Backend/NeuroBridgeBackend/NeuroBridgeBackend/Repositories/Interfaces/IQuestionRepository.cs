using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using NeuroBridgeBackend.Repositories.Interfaces;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IQuestionRepository : IRepository<Question>
    {
        Task<IEnumerable<Question>> GetByQuizIdAsync(int quizId);
        Task<Question?> GetByIdAsync(int id);
        Task DeleteByIdAsync(int id);
    }
}
