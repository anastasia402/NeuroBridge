using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.Models;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")] 
    public class UsersController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("mentors")] 
        public async Task<IActionResult> GetMentors()
        {
            var mentors = await _userManager.GetUsersInRoleAsync("Mentor");
            
            var result = mentors.Select((m, index) => new {
                id = m.Id,
                name = m.FullName,
                points = m.ExperiencePoints,
                level = m.Level,
                avatar = index == 0 ? "🏆" : index == 1 ? "🥈" : "🥉",
                rating = 4.9 - (index * 0.1),
                sessions = 100 - (index * 15)
            }).OrderByDescending(m => m.points).ToList();

            return Ok(result);
        }
    }
}