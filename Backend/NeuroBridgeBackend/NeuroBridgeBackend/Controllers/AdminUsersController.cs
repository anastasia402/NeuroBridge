using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize(Roles = "Admin")]
    public class AdminUsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDbContext _context;

        private static readonly string[] AllowedRoles = { "Admin", "Mentor", "Junior" };

        public AdminUsersController(UserManager<User> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        /// <summary>GET /api/admin/users?page=1&pageSize=20&role=Junior&search=alex</summary>
        [HttpGet]
        public async Task<ActionResult<AdminUsersPagedResponse>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20,
            [FromQuery] string? role = null,
            [FromQuery] string? search = null)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
                query = query.Where(u =>
                    (u.FullName != null && u.FullName.Contains(search)) ||
                    (u.Email != null && u.Email.Contains(search)));

            if (!string.IsNullOrWhiteSpace(role))
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role);
                var ids = usersInRole.Select(u => u.Id).ToHashSet();
                query = query.Where(u => ids.Contains(u.Id));
            }

            var total = await query.CountAsync();
            var users = await query
                .OrderBy(u => u.FullName)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var items = new List<AdminUserDto>();
            foreach (var u in users)
            {
                var roles = await _userManager.GetRolesAsync(u);
                items.Add(MapToDto(u, roles.FirstOrDefault() ?? "—"));
            }

            return Ok(new AdminUsersPagedResponse
            {
                Items = items,
                TotalCount = total,
                Page = page,
                PageSize = pageSize
            });
        }

        /// <summary>GET /api/admin/users/{id}</summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<AdminUserDto>> GetById(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound($"User {id} not found.");

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(MapToDto(user, roles.FirstOrDefault() ?? "—"));
        }

        /// <summary>POST /api/admin/users — crează user cu rol specific</summary>
        [HttpPost]
        public async Task<ActionResult<AdminUserDto>> Create([FromBody] CreateUserRequest request)
        {
            if (!AllowedRoles.Contains(request.Role))
                return BadRequest(new { message = $"Rol invalid. Valori acceptate: {string.Join(", ", AllowedRoles)}" });

            if (await _userManager.FindByEmailAsync(request.Email) != null)
                return BadRequest(new { message = "Există deja un cont cu acest email." });

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                Role = Enum.Parse<UserRole>(request.Role.ToUpper()),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(new { message = "Creare eșuată.", errors = result.Errors.Select(e => e.Description) });

            await _userManager.AddToRoleAsync(user, request.Role);

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, MapToDto(user, request.Role));
        }

        /// <summary>PUT /api/admin/users/{id}/role — schimbă rolul</summary>
        [HttpPut("{id}/role")]
        public async Task<ActionResult<AdminUserDto>> ChangeRole(int id, [FromBody] ChangeRoleRequest request)
        {
            if (!AllowedRoles.Contains(request.Role))
                return BadRequest(new { message = $"Rol invalid. Valori acceptate: {string.Join(", ", AllowedRoles)}" });

            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound($"User {id} not found.");

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, request.Role);

            user.Role = Enum.Parse<UserRole>(request.Role.ToUpper());
            await _userManager.UpdateAsync(user);

            return Ok(MapToDto(user, request.Role));
        }

        /// <summary>DELETE /api/admin/users/{id} — dezactivare soft (nu șterge din DB)</summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Deactivate(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound($"User {id} not found.");

            if (user.Email == "admin@neurobridge.com")
                return BadRequest(new { message = "Contul de admin principal nu poate fi dezactivat." });

            user.IsActive = false;
            await _userManager.UpdateAsync(user);

            return NoContent();
        }

        /// <summary>PUT /api/admin/users/{id}/activate — reactivare</summary>
        [HttpPut("{id}/activate")]
        public async Task<ActionResult<AdminUserDto>> Activate(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound($"User {id} not found.");

            user.IsActive = true;
            await _userManager.UpdateAsync(user);

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(MapToDto(user, roles.FirstOrDefault() ?? "—"));
        }

        /// <summary>GET /api/admin/users/{id}/progress — progres junior</summary>
        [HttpGet("{id}/progress")]
        public async Task<ActionResult<UserProgressDto>> GetProgress(int id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null) return NotFound($"User {id} not found.");

            var quizResults = await _context.QuizResults
                .Where(r => r.JuniorId == id)
                .Include(r => r.Quiz)
                    .ThenInclude(q => q.Material)
                .OrderByDescending(r => r.CompletedAt)
                .Take(10)
                .ToListAsync();

            var completedSessions = await _context.MentoringSessions
                .Where(s => s.JuniorId == id && s.Status == MentoringSessionStatus.COMPLETED)
                .CountAsync();

            var avgScore = quizResults.Count > 0
                ? quizResults.Average(r => r.TotalQuestions > 0 ? (double)r.Score / r.TotalQuestions * 100 : 0)
                : 0;

            return Ok(new UserProgressDto
            {
                UserId = user.Id,
                FullName = user.FullName ?? user.UserName ?? string.Empty,
                Level = user.Level,
                ExperiencePoints = user.ExperiencePoints,
                CurrentStreak = user.CurrentStreak,
                TotalQuizzesTaken = quizResults.Count,
                AverageScore = Math.Round(avgScore, 1),
                CompletedSessions = completedSessions,
                RecentQuizzes = quizResults.Select(r => new QuizResultSummary
                {
                    Score = r.Score,
                    TotalQuestions = r.TotalQuestions,
                    Percentage = r.TotalQuestions > 0 ? (int)Math.Round((double)r.Score / r.TotalQuestions * 100) : 0,
                    CompletedAt = r.CompletedAt,
                    MaterialTitle = r.Quiz?.Material?.Title
                }).ToList()
            });
        }

        private static AdminUserDto MapToDto(User u, string role) => new()
        {
            Id = u.Id,
            FullName = u.FullName ?? u.UserName ?? string.Empty,
            Email = u.Email ?? string.Empty,
            Role = role,
            Level = u.Level,
            ExperiencePoints = u.ExperiencePoints,
            CurrentStreak = u.CurrentStreak,
            MentorRating = u.MentorRating,
            CreatedAt = u.CreatedAt,
            IsActive = u.IsActive
        };
    }
}
