namespace NeuroBridgeBackend.DTOs;

public class CreateMentoringSessionDto
{
    public int JuniorId { get; set; }
    public string IssueDescription { get; set; } = string.Empty;
}