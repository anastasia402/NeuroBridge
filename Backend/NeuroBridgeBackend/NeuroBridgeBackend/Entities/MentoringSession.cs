using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class MentoringSession
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public int JuniorId { get; set; }

        public User? Junior { get; set; }

        public int? MentorId { get; set; }

        public User? Mentor { get; set; }

        [Required]
        [MaxLength(500)]
        public string Topic { get; set; } = null!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [Required]
        public MentoringSessionStatus Status { get; set; } = MentoringSessionStatus.PENDING;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? StartedAt { get; set; }

        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        public ICollection<ChatMessage> ChatMessages { get; set; } = new List<ChatMessage>();
        public MentorFeedback? Feedback { get; set; }
    }

    public enum MentoringSessionStatus
    {
        PENDING,
        ACCEPTED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
