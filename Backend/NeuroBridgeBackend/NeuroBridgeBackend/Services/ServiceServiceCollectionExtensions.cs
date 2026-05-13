using Microsoft.Extensions.DependencyInjection;
using NeuroBridgeBackend.Services.Interfaces;

namespace NeuroBridgeBackend.Services
{
    public static class ServiceServiceCollectionExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IMaterialService, MaterialService>();
            services.AddScoped<IQuizService, QuizService>();
            services.AddScoped<IQuestionService, QuestionService>();
            services.AddScoped<ITestEntityService, TestEntityService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<IAIService, AIService>();
            services.AddScoped<IChatMessageService, ChatMessageService>();
            services.AddScoped<IMaterialAssignmentService, MaterialAssignmentService>();
            services.AddScoped<IUserGroupService, UserGroupService>();
            services.AddScoped<IMentoringSessionService, MentoringSessionService>();
            services.AddScoped<IOrgSettingsService, OrgSettingsService>();

            return services;
        }
    }
}
