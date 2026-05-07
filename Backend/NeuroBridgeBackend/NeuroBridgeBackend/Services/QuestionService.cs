using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;

        public QuestionService(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
        }

        public async Task<IEnumerable<Question>> GetAllQuestionsAsync()
        {
            return await _questionRepository.GetAllAsync();
        }

        public async Task<Question?> GetQuestionByIdAsync(int id)
        {
            return await _questionRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Question>> GetQuestionsByQuizIdAsync(int quizId)
        {
            return await _questionRepository.GetByQuizIdAsync(quizId);
        }

        public async Task CreateQuestionAsync(Question question)
        {
            await _questionRepository.AddAsync(question);
            await _questionRepository.SaveChangesAsync();
        }

        public async Task UpdateQuestionAsync(Question question)
        {
            _questionRepository.Update(question);
            await _questionRepository.SaveChangesAsync();
        }

        public async Task DeleteQuestionAsync(int id)
        {
            await _questionRepository.DeleteByIdAsync(id);
        }
    }
}
