using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class MentorFeedback
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        public MentoringSession? Session { get; set; }

        [Required]
        public int MentorId { get; set; }

        public User? Mentor { get; set; }

        [Required]
        [Range(1, 5)]
        public int Rating { get; set; }

        [MaxLength(1000)]
        public string? Comments { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public MentoringSession? MentoringSession { get; set; }
    }
}
