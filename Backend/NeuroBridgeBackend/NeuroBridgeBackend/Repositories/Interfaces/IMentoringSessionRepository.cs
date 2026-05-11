using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IMentoringSessionRepository : IRepository<MentoringSession>
    {
        Task<MentoringSession?> GetByIdAsync(Guid id);
        Task<IEnumerable<MentoringSession>> GetSessionsByUserIdAsync(int userId);
        Task<IEnumerable<MentoringSession>> GetActiveSessionsAsync();
        Task<IEnumerable<MentoringSession>> GetCompletedSessionsAsync();
        Task UpdateSessionStatusAsync(Guid sessionId, MentoringSessionStatus status);
    }
}