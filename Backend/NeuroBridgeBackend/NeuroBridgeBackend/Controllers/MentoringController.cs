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
}