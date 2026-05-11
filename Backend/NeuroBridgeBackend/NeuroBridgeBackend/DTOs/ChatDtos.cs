using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.DTOs
{
    public class SendMessageRequest
    {
        public string Message { get; set; } = null!;
        public ChatMessageType MessageType { get; set; } = ChatMessageType.TEXT;
    }

    public class ChatMessageDto
    {
        public int Id { get; set; }
        public Guid SessionId { get; set; }
        public int SenderId { get; set; }
        public string SenderName { get; set; } = null!;
        public string Message { get; set; } = null!;
        public ChatMessageType MessageType { get; set; }
        public DateTime SentAt { get; set; }
        public bool IsRead { get; set; }
    }

    public class JoinSessionRequest
    {
        public Guid SessionId { get; set; }
        public int UserId { get; set; }
    }
}