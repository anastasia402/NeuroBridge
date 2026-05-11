using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;

namespace NeuroBridgeBackend.Entities
{
    public class Question : IValidatableObject
    {
        [Key]
        public int Id { get; set; }

        public int QuizId { get; set; }

        public Quiz? Quiz { get; set; }

        [Required]
        public string QuestionText { get; set; } = null!;

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string OptionsJson { get; set; } = JsonSerializer.Serialize(new string[4]);

        [NotMapped]
        public string[] Options
        {
            get => string.IsNullOrWhiteSpace(OptionsJson)
                ? Array.Empty<string>()
                : JsonSerializer.Deserialize<string[]>(OptionsJson) ?? Array.Empty<string>();
            set => OptionsJson = JsonSerializer.Serialize(value ?? Array.Empty<string>());
        }

        public int CorrectIndex { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Options.Length != 4)
            {
                yield return new ValidationResult(
                    "A question must have exactly four answer options.",
                    new[] { nameof(Options) });
            }

            if (CorrectIndex < 0 || CorrectIndex >= Options.Length)
            {
                yield return new ValidationResult(
                    "CorrectIndex must reference one of the four answer options (0-3).",
                    new[] { nameof(CorrectIndex) });
            }
        }
    }
}
