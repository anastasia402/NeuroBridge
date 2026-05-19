using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;
using System.Security.Claims;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/mentoring-sessions")]
    [Authorize]
    public class MentoringSessionsController : ControllerBase
    {
        private readonly IMentoringSessionService _sessionService;
        private readonly ApplicationDbContext _context;

        public MentoringSessionsController(IMentoringSessionService sessionService, ApplicationDbContext context)
        {
            _sessionService = sessionService;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetSessions()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var role = User.FindFirstValue(ClaimTypes.Role) ?? "";
            var isMentor = role.Equals("Mentor", StringComparison.OrdinalIgnoreCase);

            IQueryable<MentoringSession> query = _context.MentoringSessions
                .Include(s => s.Junior)
                .Include(s => s.Mentor);

            if (isMentor)
            {
                // Mentors see: all PENDING requests + their own sessions
                query = query.Where(s =>
                    s.Status == MentoringSessionStatus.PENDING ||
                    s.MentorId == userId);
            }
            else
            {
                // Juniors see only their own sessions
                query = query.Where(s => s.JuniorId == userId);
            }

            var sessions = await query
                .OrderByDescending(s => s.CreatedAt)
                .ToListAsync();

            return Ok(sessions.Select(s => MapToDto(s, userId)));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSessionRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var session = new MentoringSession
            {
                JuniorId = userId,
                Topic = request.Topic,
                IssueDescription = request.IssueDescription ?? string.Empty,
                Status = MentoringSessionStatus.PENDING,
                CreatedAt = DateTime.UtcNow
            };

            var created = await _sessionService.CreateSessionAsync(session);
            return Ok(MapToDto(created, userId));
        }

        [HttpPost("{id}/accept")]
        public async Task<IActionResult> Accept(Guid id)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId)) return Unauthorized();

            var session = await _sessionService.GetSessionByIdAsync(id);
            if (session == null) return NotFound();
            if (session.Status != MentoringSessionStatus.PENDING)
                return BadRequest("Session is not pending");

            session.MentorId = userId;
            session.Status = MentoringSessionStatus.ACCEPTED;
            session.StartedAt = DateTime.UtcNow;
            await _sessionService.UpdateSessionAsync(session);

            // reload with navigation properties
            await _context.Entry(session).Reference(s => s.Junior).LoadAsync();
            await _context.Entry(session).Reference(s => s.Mentor).LoadAsync();

            return Ok(MapToDto(session, userId));
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(Guid id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);
            if (session == null) return NotFound();

            session.Status = MentoringSessionStatus.CANCELLED;
            await _sessionService.UpdateSessionAsync(session);

            return Ok(MapToDto(session, 0));
        }

        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(Guid id)
        {
            var session = await _sessionService.GetSessionByIdAsync(id);
            if (session == null) return NotFound();

            session.Status = MentoringSessionStatus.COMPLETED;
            session.CompletedAt = DateTime.UtcNow;
            await _sessionService.UpdateSessionAsync(session);

            return Ok(MapToDto(session, 0));
        }

        private static object MapToDto(MentoringSession s, int currentUserId) => new
        {
            id = s.Id,
            topic = s.Topic,
            issueDescription = s.IssueDescription,
            status = s.Status.ToString(),
            createdAt = s.CreatedAt,
            startedAt = s.StartedAt,
            completedAt = s.CompletedAt,
            juniorId = s.JuniorId,
            juniorName = s.Junior?.FullName ?? "Junior",
            mentorId = s.MentorId,
            mentorName = s.Mentor?.FullName,
        };
    }

    public class CreateSessionRequest
    {
        public string Topic { get; set; } = null!;
        public string? IssueDescription { get; set; }
    }
}
