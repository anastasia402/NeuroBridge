using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using System.Security.Claims;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/sessions")]
    [Authorize]
    public class MentoringSessionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MentoringSessionsController(ApplicationDbContext context)
        {
            _context = context;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        /// <summary>GET /api/sessions/open — sesiuni PENDING fără mentor (pentru mentori)</summary>
        [HttpGet("open")]
        public async Task<IActionResult> GetOpen()
        {
            var sessions = await _context.MentoringSessions
                .Where(s => s.Status == MentoringSessionStatus.PENDING && s.MentorId == null)
                .Include(s => s.Junior)
                .OrderByDescending(s => s.CreatedAt)
                .Select(s => new {
                    id = s.Id,
                    topic = s.Topic,
                    issueDescription = s.IssueDescription,
                    juniorName = s.Junior != null ? s.Junior.FullName : "Unknown",
                    waitTime = FormatWaitTime(s.CreatedAt),
                    createdAt = s.CreatedAt
                })
                .ToListAsync();

            return Ok(sessions);
        }

        /// <summary>GET /api/sessions/my-active — sesiunile active ale mentorului curent</summary>
        [HttpGet("my-active")]
        public async Task<IActionResult> GetMyActive()
        {
            var mentorId = CurrentUserId;
            var sessions = await _context.MentoringSessions
                .Where(s => s.MentorId == mentorId &&
                       (s.Status == MentoringSessionStatus.ACCEPTED || s.Status == MentoringSessionStatus.IN_PROGRESS))
                .Include(s => s.Junior)
                .OrderByDescending(s => s.StartedAt)
                .Select(s => new {
                    id = s.Id,
                    topic = s.Topic,
                    issueDescription = s.IssueDescription,
                    juniorName = s.Junior != null ? s.Junior.FullName : "Unknown",
                    status = s.Status.ToString(),
                    startedAt = s.StartedAt
                })
                .ToListAsync();

            return Ok(sessions);
        }

        /// <summary>POST /api/sessions/request — junior creează o cerere de sesiune</summary>
        [HttpPost("request")]
        public async Task<IActionResult> RequestSession([FromBody] RequestSessionDto request)
        {
            var session = new MentoringSession
            {
                JuniorId = CurrentUserId,
                Topic = request.Topic,
                IssueDescription = request.IssueDescription ?? string.Empty,
                Status = MentoringSessionStatus.PENDING,
                CreatedAt = DateTime.UtcNow
            };

            _context.MentoringSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(new { id = session.Id, status = session.Status.ToString() });
        }

        /// <summary>PUT /api/sessions/{id}/accept — mentor acceptă sesiunea</summary>
        [HttpPut("{id}/accept")]
        public async Task<IActionResult> Accept(Guid id)
        {
            var session = await _context.MentoringSessions.FindAsync(id);
            if (session == null) return NotFound();
            if (session.Status != MentoringSessionStatus.PENDING)
                return BadRequest(new { message = "Sesiunea nu mai este disponibilă." });

            session.MentorId = CurrentUserId;
            session.Status = MentoringSessionStatus.ACCEPTED;
            session.StartedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { id = session.Id, status = session.Status.ToString() });
        }

        private static string FormatWaitTime(DateTime createdAt)
        {
            var diff = DateTime.UtcNow - createdAt;
            if (diff.TotalMinutes < 1) return "just now";
            if (diff.TotalMinutes < 60) return $"{(int)diff.TotalMinutes}m";
            if (diff.TotalHours < 24) return $"{(int)diff.TotalHours}h";
            return $"{(int)diff.TotalDays}d";
        }
    }

    public class RequestSessionDto
    {
        public string Topic { get; set; } = null!;
        public string? IssueDescription { get; set; }
    }
}
