namespace NeuroBridgeBackend.DTOs
{
    public class RegisterResponseDto
    {
        public bool Success { get; set; }
        public string[] Errors { get; set; } = new string[0];
    }
}
