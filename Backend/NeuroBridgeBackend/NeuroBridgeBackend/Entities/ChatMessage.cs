using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class ChatMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public Guid SessionId { get; set; }

        public MentoringSession? Session { get; set; }

        [Required]
        public int SenderId { get; set; }

        public User? Sender { get; set; }

        [Required]
        [MaxLength(2000)]
        public string Message { get; set; } = null!;

        [Required]
        public ChatMessageType MessageType { get; set; } = ChatMessageType.TEXT;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public bool IsRead { get; set; } = false;
    }

    public enum ChatMessageType
    {
        TEXT,
        SYSTEM,
        FILE
    }
}
