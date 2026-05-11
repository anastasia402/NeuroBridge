using System.ComponentModel.DataAnnotations;

namespace NeuroBridgeBackend.Entities
{
    public class UserGroup
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        public UserGroupType Type { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<User>? Users { get; set; }
        public ICollection<MaterialAssignment>? MaterialAssignments { get; set; }
    }
}
