namespace NeuroBridgeBackend.DTOs
{
    public class CreateMaterialDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public IFormFile File { get; set; } = null!;
        public int UploaderId { get; set; }
    }

    public class CreateMaterialFromTextDto
    {
        public string Title { get; set; } = null!;
        public string Content { get; set; } = null!;
        public int UploaderId { get; set; }
    }
}
