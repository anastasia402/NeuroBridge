using System.ComponentModel.DataAnnotations;

namespace NeuroBridgeBackend.Entities
{
    public class OrganizationSetting
    {
        [Key]
        [MaxLength(100)]
        public string Key { get; set; } = null!;

        [Required]
        [MaxLength(500)]
        public string Value { get; set; } = null!;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
