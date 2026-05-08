using Microsoft.Extensions.DependencyInjection;
using NeuroBridgeBackend.Repositories.Interfaces;

namespace NeuroBridgeBackend.Repositories
{
    public static class RepositoryServiceCollectionExtensions
    {
        public static IServiceCollection AddRepositories(this IServiceCollection services)
        {
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<ITestEntityRepository, TestEntityRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IMaterialRepository, MaterialRepository>();
            services.AddScoped<IQuizRepository, QuizRepository>();
            services.AddScoped<IQuestionRepository, QuestionRepository>();
            services.AddScoped<IChatMessageRepository, ChatMessageRepository>();
            services.AddScoped<IMentoringSessionRepository, MentoringSessionRepository>();

            return services;
        }
    }
}
