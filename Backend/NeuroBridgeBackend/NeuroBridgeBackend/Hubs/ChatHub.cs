using Microsoft.AspNetCore.SignalR;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Concurrent;

namespace NeuroBridgeBackend.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IChatMessageService _chatMessageService;
        private readonly IServiceProvider _serviceProvider;

        // Track active connections per session
        private static readonly ConcurrentDictionary<string, HashSet<string>> _sessionConnections = new();
        private static readonly ConcurrentDictionary<string, (Guid SessionId, int UserId)> _connectionInfo = new();

        public ChatHub(IChatMessageService chatMessageService, IServiceProvider serviceProvider)
        {
            _chatMessageService = chatMessageService;
            _serviceProvider = serviceProvider;
        }

        public async Task JoinSession(JoinSessionRequest request)
        {
            // Validate session exists and user is participant
            using var scope = _serviceProvider.CreateScope();
            var mentoringService = scope.ServiceProvider.GetRequiredService<IMentoringSessionService>();

            var session = await mentoringService.GetSessionByIdAsync(request.SessionId);
            if (session == null)
            {
                await Clients.Caller.SendAsync("Error", "Session not found");
                return;
            }

            if (session.JuniorId != request.UserId && session.MentorId != request.UserId)
            {
                await Clients.Caller.SendAsync("Error", "You are not a participant in this session");
                return;
            }

            // Add to session group
            var groupName = $"session-{request.SessionId}";
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // Track connection
            _connectionInfo[Context.ConnectionId] = (request.SessionId, request.UserId);
            _sessionConnections.GetOrAdd(groupName, _ => new HashSet<string>()).Add(Context.ConnectionId);

            // Send existing messages
            var messages = await _chatMessageService.GetMessagesBySessionIdAsync(request.SessionId);
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

            await Clients.Caller.SendAsync("LoadMessages", messageDtos);

            // Notify others that user joined
            await Clients.OthersInGroup(groupName).SendAsync("UserJoined", new
            {
                UserId = request.UserId,
                UserName = session.JuniorId == request.UserId ? session.Junior?.FullName : session.Mentor?.FullName,
                Timestamp = DateTime.UtcNow
            });
        }

        public async Task SendMessage(SendMessageRequest request)
        {
            if (!_connectionInfo.TryGetValue(Context.ConnectionId, out var connectionInfo))
            {
                await Clients.Caller.SendAsync("Error", "Not connected to any session");
                return;
            }

            var (sessionId, userId) = connectionInfo;

            // Save message to database
            var message = await _chatMessageService.SendMessageAsync(sessionId, userId, request.Message, request.MessageType);

            // Create DTO for broadcasting
            var messageDto = new ChatMessageDto
            {
                Id = message.Id,
                SessionId = message.SessionId,
                SenderId = message.SenderId,
                SenderName = message.Sender?.FullName ?? "Unknown",
                Message = message.Message,
                MessageType = message.MessageType,
                SentAt = message.SentAt,
                IsRead = message.IsRead
            };

            // Broadcast to all participants in the session
            var groupName = $"session-{sessionId}";
            await Clients.Group(groupName).SendAsync("ReceiveMessage", messageDto);

            // Mark messages as read for sender (they've seen their own message)
            await _chatMessageService.MarkMessagesAsReadAsync(sessionId, userId);
        }

        public async Task MarkAsRead()
        {
            if (!_connectionInfo.TryGetValue(Context.ConnectionId, out var connectionInfo))
            {
                return;
            }

            var (sessionId, userId) = connectionInfo;
            await _chatMessageService.MarkMessagesAsReadAsync(sessionId, userId);
        }

        public async Task LeaveSession()
        {
            if (_connectionInfo.TryRemove(Context.ConnectionId, out var connectionInfo))
            {
                var (sessionId, userId) = connectionInfo;
                var groupName = $"session-{sessionId}";

                await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

                if (_sessionConnections.TryGetValue(groupName, out var connections))
                {
                    connections.Remove(Context.ConnectionId);
                    if (connections.Count == 0)
                    {
                        _sessionConnections.TryRemove(groupName, out _);
                    }
                }

                // Notify others that user left
                await Clients.OthersInGroup(groupName).SendAsync("UserLeft", new
                {
                    UserId = userId,
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_connectionInfo.TryRemove(Context.ConnectionId, out var connectionInfo))
            {
                var (sessionId, userId) = connectionInfo;
                var groupName = $"session-{sessionId}";

                if (_sessionConnections.TryGetValue(groupName, out var connections))
                {
                    connections.Remove(Context.ConnectionId);
                    if (connections.Count == 0)
                    {
                        _sessionConnections.TryRemove(groupName, out _);
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}