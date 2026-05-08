using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Services.Interfaces;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly IChatMessageService _chatMessageService;

        public ChatController(IChatMessageService chatMessageService)
        {
            _chatMessageService = chatMessageService;
        }

        /// <summary>
        /// Get all messages for a specific session
        /// </summary>
        [HttpGet("session/{sessionId}/messages")]
        public async Task<IActionResult> GetMessages(Guid sessionId)
        {
            var messages = await _chatMessageService.GetMessagesBySessionIdAsync(sessionId);
            var messageDtos = messages.Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SessionId = m.SessionId,
                SenderId = m.SenderId,
                SenderName = m.Sender?.FullName ?? "Unknown",
                Message = m.Message,
                MessageType = m.MessageType,
                SentAt = m.SentAt,
                IsRead = m.IsRead
            });

            return Ok(messageDtos);
        }

        /// <summary>
        /// Get unread messages for a user
        /// </summary>
        [HttpGet("user/{userId}/unread")]
        public async Task<IActionResult> GetUnreadMessages(int userId)
        {
            var messages = await _chatMessageService.GetUnreadMessagesAsync(userId);
            var messageDtos = messages.Select(m => new ChatMessageDto
            {
                Id = m.Id,
                SessionId = m.SessionId,
                SenderId = m.SenderId,
                SenderName = m.Sender?.FullName ?? "Unknown",
                Message = m.Message,
                MessageType = m.MessageType,
                SentAt = m.SentAt,
                IsRead = m.IsRead
            });

            return Ok(messageDtos);
        }

        /// <summary>
        /// Mark messages as read for a session
        /// </summary>
        [HttpPost("session/{sessionId}/mark-read")]
        public async Task<IActionResult> MarkAsRead(Guid sessionId, [FromQuery] int userId)
        {
            await _chatMessageService.MarkMessagesAsReadAsync(sessionId, userId);
            return Ok();
        }
    }
}