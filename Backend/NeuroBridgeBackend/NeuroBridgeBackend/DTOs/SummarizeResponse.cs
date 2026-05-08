namespace NeuroBridgeBackend.DTOs
{
    public class SummarizeResponse
    {
        public int MaterialId { get; set; }
        public string Summary { get; set; } = null!;
        public DateTime GeneratedAt { get; set; }
    }
}
