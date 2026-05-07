namespace NeuroBridgeBackend.DTOs
{
    public class MaterialResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = null!;
        public string ContentText { get; set; } = null!;
        public string? FileUrl { get; set; }
        public int UploaderId { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
