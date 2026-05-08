using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly IChatMessageRepository _chatMessageRepository;

        public ChatMessageService(IChatMessageRepository chatMessageRepository)
        {
            _chatMessageRepository = chatMessageRepository;
        }

        public async Task<IEnumerable<ChatMessage>> GetMessagesBySessionIdAsync(Guid sessionId)
        {
            return await _chatMessageRepository.GetMessagesBySessionIdAsync(sessionId);
        }

        public async Task<ChatMessage> SendMessageAsync(Guid sessionId, int senderId, string message, ChatMessageType messageType = ChatMessageType.TEXT)
        {
            var chatMessage = new ChatMessage
            {
                SessionId = sessionId,
                SenderId = senderId,
                Message = message,
                MessageType = messageType,
                IsRead = false
            };

            await _chatMessageRepository.AddAsync(chatMessage);
            await _chatMessageRepository.SaveChangesAsync();

            return chatMessage;
        }

        public async Task MarkMessagesAsReadAsync(Guid sessionId, int userId)
        {
            await _chatMessageRepository.MarkMessagesAsReadAsync(sessionId, userId);
        }

        public async Task<IEnumerable<ChatMessage>> GetUnreadMessagesAsync(int userId)
        {
            return await _chatMessageRepository.GetUnreadMessagesAsync(userId);
        }

        public async Task DeleteMessagesBySessionIdAsync(Guid sessionId)
        {
            await _chatMessageRepository.DeleteMessagesBySessionIdAsync(sessionId);
        }
    }
}