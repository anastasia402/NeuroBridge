using System.ComponentModel.DataAnnotations;

namespace NeuroBridgeBackend.DTOs
{
    public class OrgSettingsResponse
    {
        public string OrganizationName { get; set; } = null!;
        public string PrimaryColor { get; set; } = null!;
        public string? LogoUrl { get; set; }
        public string? WelcomeMessage { get; set; }
    }

    public class UpdateOrgSettingsRequest
    {
        [MaxLength(100)]
        public string? OrganizationName { get; set; }

        [MaxLength(7)]
        public string? PrimaryColor { get; set; }

        [MaxLength(500)]
        public string? LogoUrl { get; set; }

        [MaxLength(300)]
        public string? WelcomeMessage { get; set; }
    }
}
