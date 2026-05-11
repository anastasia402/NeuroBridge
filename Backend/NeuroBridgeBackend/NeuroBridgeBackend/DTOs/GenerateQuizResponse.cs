namespace NeuroBridgeBackend.DTOs
{
    public class GenerateQuizResponse
    {
        public int QuizId { get; set; }
        public int MaterialId { get; set; }
        public string Difficulty { get; set; } = null!;
        public string Status { get; set; } = "PENDING";
        public List<QuestionData> Questions { get; set; } = new List<QuestionData>();
        public DateTime CreatedAt { get; set; }
    }
}
