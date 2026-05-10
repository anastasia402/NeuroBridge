using System;

namespace NeuroBridgeBackend.Models
{
    public enum SessionStatus { Open, Active, Closed }

    public class MentoringSession
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string IssueDescription { get; set; } = string.Empty;
        public string JuniorId { get; set; } = string.Empty;
        public string? MentorId { get; set; }
        public SessionStatus Status { get; set; } = SessionStatus.Open;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ClosedAt { get; set; }
    }
}