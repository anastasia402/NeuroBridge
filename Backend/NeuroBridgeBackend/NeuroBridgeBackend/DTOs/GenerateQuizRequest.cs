namespace NeuroBridgeBackend.DTOs
{
    public class GenerateQuizRequest
    {
        public int MaterialId { get; set; }
        public string ContentText { get; set; } = null!;
        public int NumberOfQuestions { get; set; } = 5;
        public string Difficulty { get; set; } = "MEDIUM"; // EASY, MEDIUM, HARD
    }
}
