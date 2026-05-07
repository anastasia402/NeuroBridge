using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NeuroBridgeBackend.Entities
{
    public class Material
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        [Required]
        [Column(TypeName = "nvarchar(max)")]
        public string ContentText { get; set; } = null!;

        public string? FileUrl { get; set; }

        public int UploaderId { get; set; }

        public User? Uploader { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
