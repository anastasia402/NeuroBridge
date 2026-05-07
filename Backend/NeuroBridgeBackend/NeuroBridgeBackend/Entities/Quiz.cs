using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class Quiz
    {
        [Key]
        public int Id { get; set; }

        public int MaterialId { get; set; }

        public Material? Material { get; set; }

        [Required]
        public QuizDifficulty Difficulty { get; set; }

        [Required]
        public QuizStatus Status { get; set; }

        public ICollection<Question> Questions { get; set; } = new List<Question>();
    }
}
