
namespace NeuroBridgeBackend.Entities
{
    public class QuizResult
    {
        public int Id { get; set; }
        public int JuniorId{ get; set; }
        public int QuizId { get; set; }
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public string UserAnswers { get; set; }
        public DateTime CompletedAt { get; set; }
        public User User { get; set; }
        public Quiz Quiz { get; set; }
    }
}
