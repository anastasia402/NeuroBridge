using Microsoft.AspNetCore.Identity;

namespace NeuroBridgeBackend.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public int Level { get; set; } = 1;
        public int ExperiencePoints { get; set; } = 0;
        public int CurrentStreak { get; set; } = 0;
    }
}