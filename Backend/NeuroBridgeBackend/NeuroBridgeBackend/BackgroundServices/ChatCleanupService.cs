using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using NeuroBridgeBackend.Services.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.BackgroundServices
{
    public class ChatCleanupService : BackgroundService
    {
        private readonly ILogger<ChatCleanupService> _logger;
        private readonly IServiceProvider _serviceProvider;
        private readonly TimeSpan _cleanupInterval = TimeSpan.FromHours(1); // Run every hour

        public ChatCleanupService(
            ILogger<ChatCleanupService> logger,
            IServiceProvider serviceProvider)
        {
            _logger = logger;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Chat Cleanup Service is starting.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CleanupCompletedSessionsAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while cleaning up completed sessions");
                }

                await Task.Delay(_cleanupInterval, stoppingToken);
            }

            _logger.LogInformation("Chat Cleanup Service is stopping.");
        }

        private async Task CleanupCompletedSessionsAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();
            var mentoringSessionService = scope.ServiceProvider.GetRequiredService<IMentoringSessionService>();
            var chatMessageService = scope.ServiceProvider.GetRequiredService<IChatMessageService>();

            // Get all completed sessions
            var completedSessions = await mentoringSessionService.GetCompletedSessionsAsync();

            foreach (var session in completedSessions)
            {
                // Check if session was completed more than 24 hours ago
                if (session.CompletedAt.HasValue &&
                    DateTime.UtcNow - session.CompletedAt.Value > TimeSpan.FromHours(24))
                {
                    _logger.LogInformation($"Cleaning up chat messages for completed session {session.Id}");

                    // Delete chat messages for this session
                    await chatMessageService.DeleteMessagesBySessionIdAsync(session.Id);

                    _logger.LogInformation($"Successfully cleaned up chat messages for session {session.Id}");
                }
            }
        }
    }
}