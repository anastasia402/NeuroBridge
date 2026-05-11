using NeuroBridgeBackend.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IChatMessageService
    {
        Task<IEnumerable<ChatMessage>> GetMessagesBySessionIdAsync(Guid sessionId);
        Task<ChatMessage> SendMessageAsync(Guid sessionId, int senderId, string message, ChatMessageType messageType = ChatMessageType.TEXT);
        Task MarkMessagesAsReadAsync(Guid sessionId, int userId);
        Task<IEnumerable<ChatMessage>> GetUnreadMessagesAsync(int userId);
        Task DeleteMessagesBySessionIdAsync(Guid sessionId);
    }
}