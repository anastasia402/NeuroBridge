using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class User : IdentityUser<int>
    {
        public string? FullName { get; set; }

        [Required]
        public UserRole Role { get; set; }

        public int? UserGroupId { get; set; }

        public UserGroup? UserGroup { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal? MentorRating { get; set; }

        public DateTime CreatedAt { get; set; }
        public int ExperiencePoints { get; internal set; }
        public int Level { get; internal set; }
        public int CurrentStreak { get; set; }
        public bool IsActive { get; set; } = true;
    }
}