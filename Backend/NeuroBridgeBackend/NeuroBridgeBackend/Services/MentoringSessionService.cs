using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class MentoringSessionService : IMentoringSessionService
    {
        private readonly IMentoringSessionRepository _mentoringSessionRepository;
        private readonly IChatMessageService _chatMessageService;

        public MentoringSessionService(
            IMentoringSessionRepository mentoringSessionRepository,
            IChatMessageService chatMessageService)
        {
            _mentoringSessionRepository = mentoringSessionRepository;
            _chatMessageService = chatMessageService;
        }

        public async Task<MentoringSession?> GetSessionByIdAsync(Guid id)
        {
            return await _mentoringSessionRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<MentoringSession>> GetSessionsByUserIdAsync(int userId)
        {
            return await _mentoringSessionRepository.GetSessionsByUserIdAsync(userId);
        }

        public async Task<IEnumerable<MentoringSession>> GetActiveSessionsAsync()
        {
            return await _mentoringSessionRepository.GetActiveSessionsAsync();
        }

        public async Task<IEnumerable<MentoringSession>> GetCompletedSessionsAsync()
        {
            return await _mentoringSessionRepository.GetCompletedSessionsAsync();
        }

        public async Task<MentoringSession> CreateSessionAsync(MentoringSession session)
        {
            await _mentoringSessionRepository.AddAsync(session);
            await _mentoringSessionRepository.SaveChangesAsync();
            return session;
        }

        public async Task UpdateSessionAsync(MentoringSession session)
        {
            _mentoringSessionRepository.Update(session);
            await _mentoringSessionRepository.SaveChangesAsync();
        }

        public async Task UpdateSessionStatusAsync(Guid sessionId, MentoringSessionStatus status)
        {
            await _mentoringSessionRepository.UpdateSessionStatusAsync(sessionId, status);

            // If session is completed, delete chat messages
            if (status == MentoringSessionStatus.COMPLETED || status == MentoringSessionStatus.CANCELLED)
            {
                await _chatMessageService.DeleteMessagesBySessionIdAsync(sessionId);
            }
        }

        public async Task DeleteSessionAsync(Guid id)
        {
            var session = await GetSessionByIdAsync(id);
            if (session != null)
            {
                // Delete chat messages first
                await _chatMessageService.DeleteMessagesBySessionIdAsync(id);

                _mentoringSessionRepository.Delete(session);
                await _mentoringSessionRepository.SaveChangesAsync();
            }
        }
    }
}