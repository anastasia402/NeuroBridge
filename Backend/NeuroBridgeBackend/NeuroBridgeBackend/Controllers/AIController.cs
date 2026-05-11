using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Services.Interfaces;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AIController : ControllerBase
    {
        private readonly IAIService _aiService;
        private readonly IMaterialService _materialService;
        private readonly ILogger<AIController> _logger;

        public AIController(IAIService aiService, IMaterialService materialService, ILogger<AIController> logger)
        {
            _aiService = aiService;
            _materialService = materialService;
            _logger = logger;
        }

        /// <summary>
        /// Generate a quiz from material content using AI
        /// </summary>
        [HttpPost("generate-quiz")]
        public async Task<ActionResult<GenerateQuizResponse>> GenerateQuiz([FromBody] GenerateQuizRequest request)
        {
            try
            {
                // Validate material exists
                var material = await _materialService.GetMaterialByIdAsync(request.MaterialId);
                if (material == null)
                {
                    return NotFound($"Material with ID {request.MaterialId} not found");
                }

                // Use material content if not provided
                if (string.IsNullOrWhiteSpace(request.ContentText))
                {
                    request.ContentText = material.ContentText;
                }

                _logger.LogInformation($"Generating quiz for material {request.MaterialId} with {request.NumberOfQuestions} questions");

                var response = await _aiService.GenerateQuizAsync(request);

                return CreatedAtAction(nameof(GenerateQuiz), new { quizId = response.QuizId }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating quiz: {ex.Message}");
                return StatusCode(500, new { error = "Failed to generate quiz", details = ex.Message });
            }
        }

        /// <summary>
        /// Summarize material content using AI
        /// </summary>
        [HttpPost("summarize")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult<SummarizeResponse>> Summarize([FromBody] SummarizeRequest request)
        {
            try
            {
                // Validate material exists
                var material = await _materialService.GetMaterialByIdAsync(request.MaterialId);
                if (material == null)
                {
                    return NotFound($"Material with ID {request.MaterialId} not found");
                }

                // Use material content if not provided
                if (string.IsNullOrWhiteSpace(request.ContentText))
                {
                    request.ContentText = material.ContentText;
                }

                _logger.LogInformation($"Summarizing material {request.MaterialId}");

                var response = await _aiService.SummarizeContentAsync(request);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error summarizing content: {ex.Message}");
                return StatusCode(500, new { error = "Failed to summarize content", details = ex.Message });
            }
        }

        /// <summary>
        /// Get material summary
        /// </summary>
        [HttpGet("summary/{materialId}")]
        public async Task<ActionResult<object>> GetMaterialSummary(int materialId)
        {
            try
            {
                var material = await _materialService.GetMaterialByIdAsync(materialId);
                if (material == null)
                {
                    return NotFound($"Material with ID {materialId} not found");
                }

                if (string.IsNullOrEmpty(material.Summary))
                {
                    return NotFound("Summary not available for this material. Please generate it first.");
                }

                return Ok(new { materialId = material.Id, summary = material.Summary });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error retrieving summary: {ex.Message}");
                return StatusCode(500, new { error = "Failed to retrieve summary", details = ex.Message });
            }
        }
    }
}
