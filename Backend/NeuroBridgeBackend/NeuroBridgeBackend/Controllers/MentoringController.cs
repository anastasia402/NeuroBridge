using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.Controllers;

[ApiController]
[Route("api/mentoring")]
public class MentoringController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MentoringController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("sessions/{sessionId:guid}/feedback")]
    public async Task<IActionResult> AddFeedback(
        Guid sessionId,
        [FromBody] CreateMentorFeedbackDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest("Rating must be between 1 and 5.");

        var session = await _context.MentoringSessions
            .FirstOrDefaultAsync(s => s.Id == sessionId);

        if (session == null)
            return NotFound("Mentoring session not found.");

        if (session.Status != MentoringSessionStatus.COMPLETED)
            return BadRequest("Feedback can only be added after the session is completed.");

        if (session.MentorId == null)
            return BadRequest("No mentor assigned to this session.");

        var feedbackExists = await _context.MentorFeedbacks
            .AnyAsync(f => f.SessionId == sessionId);

        if (feedbackExists)
            return BadRequest("Feedback already exists for this session.");

        var feedback = new MentorFeedback
        {
            SessionId = sessionId,
            MentorId = session.MentorId.Value,
            Rating = dto.Rating,
            Comments = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _context.MentorFeedbacks.Add(feedback);
        await _context.SaveChangesAsync();

        var averageRating = await _context.MentorFeedbacks
            .Where(f => f.MentorId == session.MentorId.Value)
            .AverageAsync(f => f.Rating);

        var mentor = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == session.MentorId.Value);

        if (mentor == null)
            return NotFound("Mentor not found.");

        mentor.MentorRating = Math.Round((decimal)averageRating, 2);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Feedback submitted successfully.",
            feedback.Id,
            feedback.SessionId,
            feedback.MentorId,
            feedback.Rating,
            feedback.Comments,
            feedback.CreatedAt,
            mentorRating = mentor.MentorRating
        });
    }

    [HttpGet("leaderboard")]
    public async Task<IActionResult> GetLeaderboard()
    {
        var mentors = await _context.Users
            .Where(u => u.Role == UserRole.MENTOR)
            .ToListAsync();

        var sessions = await _context.MentoringSessions
            .ToListAsync();

        var leaderboard = mentors
            .Select(m => new
            {
                MentorId = m.Id,
                MentorName = m.FullName,
                MentorRating = m.MentorRating,

                SessionsCount = sessions.Count(s =>
                    s.MentorId == m.Id &&
                    (int)s.Status == 3)
            })
            .OrderByDescending(x => x.MentorRating)
            .ThenByDescending(x => x.SessionsCount)
            .Take(10)
            .ToList();

        return Ok(leaderboard);
    }

    [HttpPost("sessions")]
    public async Task<IActionResult> CreateSession([FromBody] CreateMentoringSessionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.IssueDescription))
            return BadRequest("Issue description is required.");

        var junior = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == dto.JuniorId && u.Role == UserRole.JUNIOR);

        if (junior == null)
            return NotFound("Junior user not found.");

        var session = new MentoringSession
        {
            Id = Guid.NewGuid(),
            JuniorId = dto.JuniorId,
            MentorId = null,
            Topic = "Mentoring request",
            Description = dto.IssueDescription,
            IssueDescription = dto.IssueDescription,
            Status = MentoringSessionStatus.PENDING,
            CreatedAt = DateTime.UtcNow
        };

        _context.MentoringSessions.Add(session);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Mentoring session created successfully.",
            session.Id,
            session.JuniorId,
            session.MentorId,
            session.Topic,
            session.Description,
            session.IssueDescription,
            session.Status,
            session.CreatedAt
        });
    }

    [HttpGet("sessions/open")]
    public async Task<IActionResult> GetOpenSessions()
    {
        var openSessions = await _context.MentoringSessions
            .Where(s =>
                s.MentorId == null &&
                s.Status == MentoringSessionStatus.PENDING)
            .Select(s => new
            {
                s.Id,
                s.JuniorId,
                JuniorName = s.Junior != null ? s.Junior.FullName : null,
                s.Topic,
                s.Description,
                s.IssueDescription,
                s.CreatedAt,
                Status = s.Status.ToString()
            })
            .OrderByDescending(s => s.CreatedAt)
            .ToListAsync();

        return Ok(openSessions);
    }

    [HttpPost("sessions/{id}/accept")]
    public async Task<IActionResult> AcceptSession(
        Guid id,
        [FromBody] AcceptMentoringSessionDto dto)
    {
        var session = await _context.MentoringSessions
            .FirstOrDefaultAsync(s => s.Id == id);

        if (session == null)
            return NotFound("Session not found.");

        if (session.Status != MentoringSessionStatus.PENDING)
            return BadRequest("Session is not available anymore.");

        if (session.MentorId != null)
            return BadRequest("Session already accepted.");

        var mentor = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Id == dto.MentorId &&
                u.Role == UserRole.MENTOR);

        if (mentor == null)
            return NotFound("Mentor not found.");

        session.MentorId = dto.MentorId;
        session.Status = MentoringSessionStatus.IN_PROGRESS;
        session.StartedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Session accepted successfully.",
            session.Id,
            session.MentorId,
            session.Status,
            session.StartedAt
        });
    }

    [HttpPost("sessions/{uuid}/close")]
    public async Task<IActionResult> CloseSession(Guid uuid)
    {
        var session = await _context.MentoringSessions
            .FirstOrDefaultAsync(s => s.Id == uuid);

        if (session == null)
        {
            return NotFound(new { message = "Session not found." });
        }

        // doar sesiuni active pot fi închise
        if (session.Status != MentoringSessionStatus.IN_PROGRESS)
        {
            return BadRequest(new
            {
                message = "Only active sessions can be closed."
            });
        }

        session.Status = MentoringSessionStatus.COMPLETED;
        session.CompletedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Session closed successfully.",
            sessionId = session.Id,
            status = session.Status.ToString(),
            completedAt = session.CompletedAt
        });
    }
}