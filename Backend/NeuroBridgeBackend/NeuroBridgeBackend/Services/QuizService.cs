using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class QuizService : IQuizService
    {
        private readonly IQuizRepository _quizRepository;

        public QuizService(IQuizRepository quizRepository)
        {
            _quizRepository = quizRepository;
        }

        public async Task<IEnumerable<Quiz>> GetAllQuizzesAsync()
        {
            return await _quizRepository.GetAllAsync();
        }

        public async Task<Quiz?> GetQuizByIdAsync(int id)
        {
            return await _quizRepository.GetByIdAsync(id);
        }

        public async Task<IEnumerable<Quiz>> GetQuizzesByMaterialIdAsync(int materialId)
        {
            return await _quizRepository.GetByMaterialIdAsync(materialId);
        }

        public async Task CreateQuizAsync(Quiz quiz)
        {
            await _quizRepository.AddAsync(quiz);
            await _quizRepository.SaveChangesAsync();
        }

        public async Task UpdateQuizAsync(Quiz quiz)
        {
            _quizRepository.Update(quiz);
            await _quizRepository.SaveChangesAsync();
        }

        public async Task DeleteQuizAsync(int id)
        {
            await _quizRepository.DeleteByIdAsync(id);
        }

        public async Task<IEnumerable<Quiz>> GetAllWithQuestionsAsync()
        {
            return await _quizRepository.GetAllWithQuestionsAsync();
        }

        public async Task<Quiz?> GetWithQuestionsAsync(int id)
        {
            return await _quizRepository.GetWithQuestionsAsync(id);
        }

        public async Task<Quiz> ApproveQuizAsync(int id)
        {
            var quiz = await _quizRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Quiz {id} not found");

            if (quiz.Status != QuizStatus.PENDING)
                throw new InvalidOperationException($"Only PENDING quizzes can be approved. Current status: {quiz.Status}");

            quiz.Status = QuizStatus.ACTIVE;
            _quizRepository.Update(quiz);
            await _quizRepository.SaveChangesAsync();
            return quiz;
        }

        public async Task<Quiz> RejectQuizAsync(int id)
        {
            var quiz = await _quizRepository.GetByIdAsync(id)
                ?? throw new KeyNotFoundException($"Quiz {id} not found");

            if (quiz.Status != QuizStatus.PENDING)
                throw new InvalidOperationException($"Only PENDING quizzes can be rejected. Current status: {quiz.Status}");

            quiz.Status = QuizStatus.REJECTED;
            _quizRepository.Update(quiz);
            await _quizRepository.SaveChangesAsync();
            return quiz;
        }
    }
}
