namespace NeuroBridgeBackend.DTOs
{
    public class QuestionData
    {
        public string Text { get; set; } = null!;
        public List<string> Options { get; set; } = new List<string>();
        public int CorrectIndex { get; set; }
    }
}
