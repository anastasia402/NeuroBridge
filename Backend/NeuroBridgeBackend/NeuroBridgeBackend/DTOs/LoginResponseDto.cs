namespace NeuroBridgeBackend.DTOs
{
    public class LoginResponseDto
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string[] Errors { get; set; } = new string[0];
    }
}
