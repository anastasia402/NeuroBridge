using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IQuizService
    {
        Task<IEnumerable<Quiz>> GetAllQuizzesAsync();
        Task<Quiz?> GetQuizByIdAsync(int id);
        Task<IEnumerable<Quiz>> GetQuizzesByMaterialIdAsync(int materialId);
        Task CreateQuizAsync(Quiz quiz);
        Task UpdateQuizAsync(Quiz quiz);
        Task DeleteQuizAsync(int id);
        Task<IEnumerable<Quiz>> GetAllWithQuestionsAsync();
        Task<Quiz?> GetWithQuestionsAsync(int id);
        Task<Quiz> ApproveQuizAsync(int id);
        Task<Quiz> RejectQuizAsync(int id);
    }
}
