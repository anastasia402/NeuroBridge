using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;
using System.Security.Claims;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public UsersController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                role = roles.FirstOrDefault() ?? "Junior",
                level = user.Level,
                currentStreak = user.CurrentStreak,
                experiencePoints = user.ExperiencePoints,
                isActive = user.IsActive
            });
        }

        [HttpPatch("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateMeRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            if (!string.IsNullOrWhiteSpace(request.FullName))
            {
                user.FullName = request.FullName.Trim();
                await _userManager.UpdateAsync(user);
            }

            return Ok(new { fullName = user.FullName });
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