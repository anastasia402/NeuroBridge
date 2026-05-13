using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using System.Security.Claims;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        public UsersController(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("mentors")]
        public async Task<IActionResult> GetMentors()
        {
            var mentors = await _userManager.GetUsersInRoleAsync("Mentor");
            var result = mentors.Select((m, index) => new {
                id = m.Id,
                name = m.FullName,
                points = m.ExperiencePoints,
                level = m.Level,
                avatar = index == 0 ? "🏆" : index == 1 ? "🥈" : "🥉",
                rating = 4.9 - (index * 0.1),
                sessions = 100 - (index * 15)
            }).OrderByDescending(m => m.points).ToList();
            return Ok(result);
        }

        /// <summary>GET /api/users/me — profil utilizator curent</summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = roles.FirstOrDefault() ?? "Junior",
                level = user.Level,
                xp = user.ExperiencePoints,
                streak = user.CurrentStreak
            });
        }

        /// <summary>GET /api/users/me/stats — istoric quiz-uri + tendințe pentru utilizatorul curent</summary>
        [HttpGet("me/stats")]
        [Authorize]
        public async Task<IActionResult> GetMyStats()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return NotFound();

            var now = DateTime.UtcNow;
            var allResults = await _context.QuizResults
                .Where(r => r.JuniorId == userId)
                .Include(r => r.Quiz).ThenInclude(q => q.Material)
                .OrderByDescending(r => r.CompletedAt)
                .ToListAsync();

            var history = allResults.Take(20).Select(r => new {
                quizTitle = r.Quiz?.Material?.Title ?? "Quiz",
                completedAt = r.CompletedAt,
                score = r.Score,
                totalQuestions = r.TotalQuestions,
                percentage = r.TotalQuestions > 0 ? (int)Math.Round((double)r.Score / r.TotalQuestions * 100) : 0
            }).ToList();

            static object BuildTrend(List<QuizResult> results, DateTime from)
            {
                var period = results.Where(r => r.CompletedAt >= from).ToList();
                var prev = results.Where(r => r.CompletedAt < from && r.CompletedAt >= from.AddDays(-(from - DateTime.UtcNow.AddDays(-1)).TotalDays)).ToList();
                double avg = period.Count > 0 ? period.Average(r => r.TotalQuestions > 0 ? (double)r.Score / r.TotalQuestions * 100 : 0) : 0;
                return new { count = period.Count, avgScore = Math.Round(avg, 1) };
            }

            return Ok(new {
                level = user.Level,
                xp = user.ExperiencePoints,
                streak = user.CurrentStreak,
                quizHistory = history,
                trends = new {
                    d7  = BuildTrend(allResults, now.AddDays(-7)),
                    d30 = BuildTrend(allResults, now.AddDays(-30)),
                    d90 = BuildTrend(allResults, now.AddDays(-90))
                }
            });
        }
    }
}