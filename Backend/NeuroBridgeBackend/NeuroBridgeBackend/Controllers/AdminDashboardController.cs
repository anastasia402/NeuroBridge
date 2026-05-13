using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/admin/dashboard")]
    [Authorize(Roles = "Admin")]
    public class AdminDashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdminDashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>GET /api/admin/dashboard/stats — metrici reale pentru dashboard</summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var today = DateTime.UtcNow.Date;

            var totalUsers = await _context.Users.CountAsync(u => u.IsActive);

            var quizzesToday = await _context.QuizResults
                .CountAsync(r => r.CompletedAt >= today);

            var activeSessions = await _context.MentoringSessions
                .CountAsync(s => s.Status == MentoringSessionStatus.PENDING
                              || s.Status == MentoringSessionStatus.ACCEPTED
                              || s.Status == MentoringSessionStatus.IN_PROGRESS);

            var pendingQuizzes = await _context.Quizzes
                .CountAsync(q => q.Status == QuizStatus.PENDING);

            var activeQuizzes = await _context.Quizzes
                .CountAsync(q => q.Status == QuizStatus.ACTIVE);

            var totalMaterials = await _context.Materials.CountAsync();

            return Ok(new
            {
                totalUsers,
                quizzesToday,
                activeSessions,
                pendingQuizzes,
                activeQuizzes,
                totalMaterials
            });
        }

        /// <summary>GET /api/admin/dashboard/recent-users — ultimii useri + scoruri reale</summary>
        [HttpGet("recent-users")]
        public async Task<IActionResult> GetRecentUsers()
        {
            var juniors = await _context.Users
                .Where(u => u.IsActive && u.Role == UserRole.JUNIOR)
                .OrderByDescending(u => u.ExperiencePoints)
                .Take(10)
                .ToListAsync();

            var results = new List<object>();
            foreach (var u in juniors)
            {
                var quizResults = await _context.QuizResults
                    .Where(r => r.JuniorId == u.Id)
                    .ToListAsync();

                var avgScore = quizResults.Count > 0
                    ? quizResults.Average(r => r.TotalQuestions > 0 ? (double)r.Score / r.TotalQuestions * 100 : 0)
                    : 0;

                results.Add(new
                {
                    id = u.Id,
                    name = u.FullName ?? u.UserName,
                    level = u.Level,
                    xp = u.ExperiencePoints,
                    streak = u.CurrentStreak,
                    quizzesTaken = quizResults.Count,
                    avgScore = Math.Round(avgScore, 1),
                    isActive = u.IsActive
                });
            }

            return Ok(results);
        }
    }
}
