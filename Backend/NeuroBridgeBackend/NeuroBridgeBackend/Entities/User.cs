using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Email { get; set; } = null!;

        public string? PasswordHash { get; set; }

        public string? FullName { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public int? UserGroupId { get; set; }

        public UserGroup? UserGroup { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal? MentorRating { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}