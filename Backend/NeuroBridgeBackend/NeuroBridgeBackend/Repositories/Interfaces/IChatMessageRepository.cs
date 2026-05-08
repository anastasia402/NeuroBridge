using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories.Interfaces
{
    public interface IChatMessageRepository : IRepository<ChatMessage>
    {
        Task<IEnumerable<ChatMessage>> GetMessagesBySessionIdAsync(Guid sessionId);
        Task<IEnumerable<ChatMessage>> GetUnreadMessagesAsync(int userId);
        Task MarkMessagesAsReadAsync(Guid sessionId, int userId);
        Task DeleteMessagesBySessionIdAsync(Guid sessionId);
    }
}