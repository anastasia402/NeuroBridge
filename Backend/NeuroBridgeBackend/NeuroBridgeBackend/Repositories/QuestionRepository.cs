using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Repositories
{
    public class QuestionRepository : Repository<Question>, IQuestionRepository
    {
        public QuestionRepository(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<IEnumerable<Question>> GetByQuizIdAsync(int quizId)
        {
            return await Context.Questions
                .Where(q => q.QuizId == quizId)
                .ToListAsync();
        }

        public async Task<Question?> GetByIdAsync(int id)
        {
            return await base.GetByIdAsync(id);
        }

        public async Task DeleteByIdAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                Delete(entity);
                await SaveChangesAsync();
            }
        }
    }
}
