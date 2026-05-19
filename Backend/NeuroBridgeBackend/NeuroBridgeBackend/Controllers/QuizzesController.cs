using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;
using System.Security.Claims;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuizzesController : ControllerBase
    {
        private readonly IQuizService _quizService;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<QuizzesController> _logger;

        public QuizzesController(IQuizService quizService, ApplicationDbContext context, ILogger<QuizzesController> logger)
        {
            _quizService = quizService;
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all quizzes with their questions. Optionally filter by status (PENDING, ACTIVE, REJECTED, COMPLETED).
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<QuizDto>>> GetAll([FromQuery] string? status = null, [FromQuery] int? materialId = null)
        {
            var quizzes = await _quizService.GetAllWithQuestionsAsync();

            if (!string.IsNullOrWhiteSpace(status))
            {
                if (!Enum.TryParse<QuizStatus>(status.ToUpper(), out var parsedStatus))
                    return BadRequest($"Invalid status '{status}'. Valid values: PENDING, ACTIVE, COMPLETED, REJECTED");

                quizzes = quizzes.Where(q => q.Status == parsedStatus);
            }

            if (materialId.HasValue)
                quizzes = quizzes.Where(q => q.MaterialId == materialId.Value);

            var quizList = quizzes.ToList();
            var quizIds = quizList.Select(q => q.Id).ToList();

            var stats = await _context.QuizResults
                .Where(r => quizIds.Contains(r.QuizId))
                .GroupBy(r => r.QuizId)
                .Select(g => new
                {
                    QuizId = g.Key,
                    TimesPlayed = g.Count(),
                    AvgScore = g.Average(r => r.TotalQuestions > 0 ? (double)r.Score / r.TotalQuestions * 100 : 0)
                })
                .ToDictionaryAsync(x => x.QuizId);

            return Ok(quizList.Select(q =>
            {
                var dto = MapToDto(q);
                if (stats.TryGetValue(q.Id, out var s))
                {
                    dto.TimesPlayed = s.TimesPlayed;
                    dto.AvgScore = Math.Round(s.AvgScore, 1);
                }
                return dto;
            }));
        }

        /// <summary>
        /// Get a single quiz with its questions.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<QuizDto>> GetById(int id)
        {
            var quiz = await _quizService.GetWithQuestionsAsync(id);
            if (quiz == null)
                return NotFound($"Quiz {id} not found");

            return Ok(MapToDto(quiz));
        }

        /// <summary>
        /// Approve a PENDING quiz — changes status to ACTIVE so juniors can take it.
        /// </summary>
        [HttpPost("{id}/approve")]
        public async Task<ActionResult<QuizDto>> Approve(int id)
        {
            try
            {
                var quiz = await _quizService.ApproveQuizAsync(id);
                _logger.LogInformation("Quiz {QuizId} approved", id);
                return Ok(MapToDto(quiz));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Reject a PENDING quiz — changes status to REJECTED.
        /// </summary>
        [HttpPost("{id}/reject")]
        public async Task<ActionResult<QuizDto>> Reject(int id)
        {
            try
            {
                var quiz = await _quizService.RejectQuizAsync(id);
                _logger.LogInformation("Quiz {QuizId} rejected", id);
                return Ok(MapToDto(quiz));
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Submit quiz answers and save result for the current user.
        /// </summary>
        [HttpPost("{id}/submit")]
        [Authorize]
        public async Task<IActionResult> Submit(int id, [FromBody] SubmitQuizRequest request)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var quiz = await _quizService.GetWithQuestionsAsync(id);
            if (quiz == null) return NotFound();

            var score = 0;
            for (var i = 0; i < quiz.Questions.Count && i < request.Answers.Count; i++)
            {
                if (request.Answers[i] == quiz.Questions.ElementAt(i).CorrectIndex)
                    score++;
            }

            var result = new QuizResult
            {
                JuniorId = userId,
                QuizId = id,
                Score = score,
                TotalQuestions = quiz.Questions.Count,
                UserAnswers = System.Text.Json.JsonSerializer.Serialize(request.Answers),
                CompletedAt = DateTime.UtcNow
            };

            _context.QuizResults.Add(result);
            await _context.SaveChangesAsync();

            var pct = quiz.Questions.Count > 0
                ? (int)Math.Round((double)score / quiz.Questions.Count * 100)
                : 0;

            return Ok(new { score, totalQuestions = quiz.Questions.Count, percentage = pct });
        }

        /// <summary>
        /// Get quiz results for the currently logged-in user.
        /// </summary>
        [HttpGet("my-results")]
        [Authorize]
        public async Task<IActionResult> GetMyResults()
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdStr, out var userId))
                return Unauthorized();

            var results = await _context.QuizResults
                .Where(r => r.JuniorId == userId)
                .Include(r => r.Quiz).ThenInclude(q => q.Material)
                .OrderByDescending(r => r.CompletedAt)
                .Select(r => new
                {
                    id = r.Id,
                    quizId = r.QuizId,
                    materialTitle = r.Quiz.Material != null ? r.Quiz.Material.Title : $"Quiz #{r.QuizId}",
                    score = r.Score,
                    totalQuestions = r.TotalQuestions,
                    percentage = r.TotalQuestions > 0 ? (int)Math.Round((double)r.Score / r.TotalQuestions * 100) : 0,
                    completedAt = r.CompletedAt
                })
                .ToListAsync();

            return Ok(results);
        }

        private static QuizDto MapToDto(Quiz quiz) => new()
        {
            Id = quiz.Id,
            MaterialId = quiz.MaterialId,
            MaterialTitle = quiz.Material?.Title,
            Difficulty = quiz.Difficulty.ToString(),
            Status = quiz.Status.ToString(),
            Questions = quiz.Questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                Options = q.Options,
                CorrectIndex = q.CorrectIndex
            }).ToList()
        };
    }
}
