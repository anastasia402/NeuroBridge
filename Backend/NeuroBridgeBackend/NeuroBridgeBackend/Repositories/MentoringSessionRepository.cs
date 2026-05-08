using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class MentoringSessionRepository : Repository<MentoringSession>, IMentoringSessionRepository
    {
        public MentoringSessionRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<MentoringSession?> GetByIdAsync(Guid id)
        {
            return await Context.MentoringSessions
                .Include(s => s.Junior)
                .Include(s => s.Mentor)
                .Include(s => s.ChatMessages)
                .Include(s => s.Feedback)
                .FirstOrDefaultAsync(s => s.Id == id);
        }

        public async Task<IEnumerable<MentoringSession>> GetSessionsByUserIdAsync(int userId)
        {
            return await Context.MentoringSessions
                .Where(s => s.JuniorId == userId || s.MentorId == userId)
                .Include(s => s.Junior)
                .Include(s => s.Mentor)
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<MentoringSession>> GetActiveSessionsAsync()
        {
            return await Context.MentoringSessions
                .Where(s => s.Status == MentoringSessionStatus.PENDING ||
                           s.Status == MentoringSessionStatus.ACCEPTED ||
                           s.Status == MentoringSessionStatus.IN_PROGRESS)
                .Include(s => s.Junior)
                .Include(s => s.Mentor)
                .OrderBy(s => s.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<MentoringSession>> GetCompletedSessionsAsync()
        {
            return await Context.MentoringSessions
                .Where(s => s.Status == MentoringSessionStatus.COMPLETED ||
                           s.Status == MentoringSessionStatus.CANCELLED)
                .Include(s => s.Junior)
                .Include(s => s.Mentor)
                .OrderByDescending(s => s.CompletedAt)
                .ToListAsync();
        }

        public async Task UpdateSessionStatusAsync(Guid sessionId, MentoringSessionStatus status)
        {
            var session = await GetByIdAsync(sessionId);
            if (session != null)
            {
                session.Status = status;
                if (status == MentoringSessionStatus.COMPLETED || status == MentoringSessionStatus.CANCELLED)
                {
                    session.CompletedAt = DateTime.UtcNow;
                }
                else if (status == MentoringSessionStatus.IN_PROGRESS && !session.StartedAt.HasValue)
                {
                    session.StartedAt = DateTime.UtcNow;
                }

                Update(session);
                await SaveChangesAsync();
            }
        }
    }
}