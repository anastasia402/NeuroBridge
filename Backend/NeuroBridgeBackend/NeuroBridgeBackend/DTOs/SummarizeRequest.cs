namespace NeuroBridgeBackend.DTOs
{
    public class SummarizeRequest
    {
        public int MaterialId { get; set; }
        public string ContentText { get; set; } = null!;
        public string Language { get; set; } = "RO"; // RO, EN
    }
}
