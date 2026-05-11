using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IMentoringSessionService
    {
        Task<MentoringSession?> GetSessionByIdAsync(Guid id);
        Task<IEnumerable<MentoringSession>> GetSessionsByUserIdAsync(int userId);
        Task<IEnumerable<MentoringSession>> GetActiveSessionsAsync();
        Task<IEnumerable<MentoringSession>> GetCompletedSessionsAsync();
        Task<MentoringSession> CreateSessionAsync(MentoringSession session);
        Task UpdateSessionAsync(MentoringSession session);
        Task UpdateSessionStatusAsync(Guid sessionId, MentoringSessionStatus status);
        Task DeleteSessionAsync(Guid id);
    }
}