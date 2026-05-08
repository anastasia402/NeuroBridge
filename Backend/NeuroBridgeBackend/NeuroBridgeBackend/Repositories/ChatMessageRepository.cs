using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class ChatMessageRepository : Repository<ChatMessage>, IChatMessageRepository
    {
        public ChatMessageRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<ChatMessage>> GetMessagesBySessionIdAsync(Guid sessionId)
        {
            return await Context.ChatMessages
                .Where(m => m.SessionId == sessionId)
                .Include(m => m.Sender)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<ChatMessage>> GetUnreadMessagesAsync(int userId)
        {
            return await Context.ChatMessages
                .Where(m => !m.IsRead && m.SenderId != userId)
                .Include(m => m.Sender)
                .Include(m => m.Session)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }

        public async Task MarkMessagesAsReadAsync(Guid sessionId, int userId)
        {
            var unreadMessages = await Context.ChatMessages
                .Where(m => m.SessionId == sessionId && !m.IsRead && m.SenderId != userId)
                .ToListAsync();

            foreach (var message in unreadMessages)
            {
                message.IsRead = true;
            }

            await SaveChangesAsync();
        }

        public async Task DeleteMessagesBySessionIdAsync(Guid sessionId)
        {
            var messages = await Context.ChatMessages
                .Where(m => m.SessionId == sessionId)
                .ToListAsync();

            foreach (var message in messages)
            {
                Delete(message);
            }

            await SaveChangesAsync();
        }
    }
}