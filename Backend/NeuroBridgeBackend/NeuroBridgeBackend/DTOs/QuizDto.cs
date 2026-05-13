namespace NeuroBridgeBackend.DTOs
{
    public class QuizDto
    {
        public int Id { get; set; }
        public int MaterialId { get; set; }
        public string? MaterialTitle { get; set; }
        public string Difficulty { get; set; } = null!;
        public string Status { get; set; } = null!;
        public List<QuestionDto> Questions { get; set; } = new();
        public int TimesPlayed { get; set; }
        public double AvgScore { get; set; }
    }

    public class QuestionDto
    {
        public int Id { get; set; }
        public string QuestionText { get; set; } = null!;
        public string[] Options { get; set; } = Array.Empty<string>();
        public int CorrectIndex { get; set; }
    }
}
