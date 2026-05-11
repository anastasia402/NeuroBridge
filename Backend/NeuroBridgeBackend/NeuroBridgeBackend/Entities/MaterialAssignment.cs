using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class MaterialAssignment
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int MaterialId { get; set; }

        public Material? Material { get; set; }

        public int? UserId { get; set; }

        public User? User { get; set; }

        [MaxLength(50)]
        public string? AssignedRole { get; set; }

        public int? UserGroupId { get; set; }

        public UserGroup? UserGroup { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.UtcNow;
    }
}
