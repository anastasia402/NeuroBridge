using System.Text;
using System.Text.Json;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;

namespace NeuroBridgeBackend.Services
{
    public class AIService : IAIService
    {
        private readonly IConfiguration _configuration;
        private readonly IMaterialRepository _materialRepository;
        private readonly IQuizRepository _quizRepository;
        private readonly IQuestionRepository _questionRepository;
        private readonly ILogger<AIService> _logger;
        private readonly IHttpClientFactory _httpClientFactory;

        private const string GeminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

        public AIService(
            IConfiguration configuration,
            IMaterialRepository materialRepository,
            IQuizRepository quizRepository,
            IQuestionRepository questionRepository,
            ILogger<AIService> logger,
            IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _materialRepository = materialRepository;
            _quizRepository = quizRepository;
            _questionRepository = questionRepository;
            _logger = logger;
            _httpClientFactory = httpClientFactory;
        }

        public async Task<GenerateQuizResponse> GenerateQuizAsync(GenerateQuizRequest request)
        {
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    throw new InvalidOperationException("Gemini API key is not configured");
                }

                // Construct the prompt for quiz generation
                var prompt = $@"You are an educational content expert. Generate exactly {request.NumberOfQuestions} multiple-choice questions based on the following material. 
The difficulty level should be {request.Difficulty}.

Material:
{request.ContentText}

Generate the response as a valid JSON array with the following structure:
[
  {{
    ""text"": ""Question text here?"",
    ""options"": [""Option 1"", ""Option 2"", ""Option 3"", ""Option 4""],
    ""correctIndex"": 0
  }}
]

Rules:
- Each question must have exactly 4 options
- correctIndex must be 0, 1, 2, or 3 (zero-indexed)
- Ensure all questions are distinct and based on the material
- Return ONLY valid JSON, no additional text";

                var responseText = await CallGeminiAPI(apiKey, prompt);
                _logger.LogInformation($"Gemini API Response: {responseText}");

                // Parse the JSON response
                var questions = ParseQuizResponse(responseText);

                // Create Quiz in database
                var difficulty = Enum.Parse<QuizDifficulty>(request.Difficulty);
                var quiz = new Quiz
                {
                    MaterialId = request.MaterialId,
                    Difficulty = difficulty,
                    Status = QuizStatus.PENDING
                };

                await _quizRepository.AddAsync(quiz);
                await _quizRepository.SaveChangesAsync();

                // Add questions to the quiz
                foreach (var question in questions)
                {
                    var dbQuestion = new Question
                    {
                        QuizId = quiz.Id,
                        QuestionText = question.Text,
                        CorrectIndex = question.CorrectIndex,
                        Options = question.Options.ToArray()
                    };

                    await _questionRepository.AddAsync(dbQuestion);
                }

                await _questionRepository.SaveChangesAsync();

                _logger.LogInformation($"Quiz created with ID: {quiz.Id} containing {questions.Count} questions");

                return new GenerateQuizResponse
                {
                    QuizId = quiz.Id,
                    MaterialId = request.MaterialId,
                    Difficulty = request.Difficulty,
                    Status = QuizStatus.PENDING.ToString(),
                    Questions = questions,
                    CreatedAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating quiz: {ex.Message}");
                throw;
            }
        }

        public async Task<SummarizeResponse> SummarizeContentAsync(SummarizeRequest request)
        {
            try
            {
                var apiKey = _configuration["Gemini:ApiKey"];
                if (string.IsNullOrEmpty(apiKey))
                {
                    throw new InvalidOperationException("Gemini API key is not configured");
                }

                // Construct the prompt for summarization
                var languageInstruction = request.Language == "RO"
                    ? "Provide the summary in Romanian."
                    : "Provide the summary in English.";

                var prompt = $@"You are an expert summarizer. Provide a comprehensive but concise summary of the following educational material.
{languageInstruction}

The summary should:
- Cover all main points
- Be 2-4 paragraphs long
- Be suitable for students
- Use clear and accessible language

Material:
{request.ContentText}

Summary:";

                var summary = await CallGeminiAPI(apiKey, prompt);

                if (string.IsNullOrEmpty(summary))
                {
                    throw new InvalidOperationException("Empty response from Gemini API");
                }

                // Update material with summary
                var material = await _materialRepository.GetByIdAsync(request.MaterialId);
                if (material != null)
                {
                    material.Summary = summary.Trim();
                    _materialRepository.Update(material);
                    await _materialRepository.SaveChangesAsync();
                }

                _logger.LogInformation($"Material {request.MaterialId} summarized successfully");

                return new SummarizeResponse
                {
                    MaterialId = request.MaterialId,
                    Summary = summary.Trim(),
                    GeneratedAt = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error summarizing content: {ex.Message}");
                throw;
            }
        }

        private async Task<string> CallGeminiAPI(string apiKey, string prompt)
        {
            try
            {
                // Create client without retry policy for single request
                var httpClient = _httpClientFactory.CreateClient();
                
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = prompt }
                            }
                        }
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var url = $"{GeminiApiUrl}?key={apiKey}";
                var response = await httpClient.PostAsync(url, content);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"Gemini API error: {response.StatusCode} - {errorContent}");
                    throw new InvalidOperationException($"Gemini API returned {response.StatusCode}");
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<JsonElement>(responseContent);

                // Extract text from response
                var text = result
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

                return text ?? string.Empty;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error calling Gemini API: {ex.Message}");
                throw;
            }
        }

        private List<QuestionData> ParseQuizResponse(string jsonResponse)
        {
            try
            {
                // Extract JSON array from response (in case there's extra text)
                var jsonStart = jsonResponse.IndexOf('[');
                var jsonEnd = jsonResponse.LastIndexOf(']');

                if (jsonStart == -1 || jsonEnd == -1)
                {
                    throw new InvalidOperationException("No JSON array found in response");
                }

                var jsonArray = jsonResponse.Substring(jsonStart, jsonEnd - jsonStart + 1);

                var questions = JsonSerializer.Deserialize<List<QuestionData>>(jsonArray, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                if (questions == null || questions.Count == 0)
                {
                    throw new InvalidOperationException("No questions parsed from response");
                }

                // Validate each question
                foreach (var question in questions)
                {
                    if (string.IsNullOrWhiteSpace(question.Text))
                        throw new InvalidOperationException("Question text is required");

                    if (question.Options.Count != 4)
                        throw new InvalidOperationException($"Each question must have exactly 4 options, got {question.Options.Count}");

                    if (question.CorrectIndex < 0 || question.CorrectIndex > 3)
                        throw new InvalidOperationException($"CorrectIndex must be 0-3, got {question.CorrectIndex}");
                }

                return questions;
            }
            catch (JsonException ex)
            {
                _logger.LogError($"JSON parsing error: {ex.Message}");
                throw;
            }
        }
    }
}
