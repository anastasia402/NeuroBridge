using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserGroupsController : ControllerBase
    {
        private readonly IUserGroupService _userGroupService;
        private readonly ILogger<UserGroupsController> _logger;

        public UserGroupsController(IUserGroupService userGroupService, ILogger<UserGroupsController> logger)
        {
            _userGroupService = userGroupService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserGroup>>> GetAll()
        {
            var groups = await _userGroupService.GetAllUserGroupsAsync();
            return Ok(groups);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserGroup>> GetById(int id)
        {
            var group = await _userGroupService.GetUserGroupByIdAsync(id);
            if (group == null)
                return NotFound(new { error = "User group not found" });

            return Ok(group);
        }

        [HttpPost]
        public async Task<ActionResult<UserGroup>> Create([FromBody] UserGroup group)
        {
            try
            {
                if (!HasAdminRole())
                    return Forbid();

                if (string.IsNullOrWhiteSpace(group.Name))
                    return BadRequest(new { error = "Group name is required" });

                var created = await _userGroupService.CreateUserGroupAsync(group);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user group");
                return StatusCode(500, new { error = "Error creating user group" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                if (!HasAdminRole())
                    return Forbid();

                await _userGroupService.DeleteUserGroupAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { error = "User group not found" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting user group");
                return StatusCode(500, new { error = "Error deleting user group" });
            }
        }

        private bool HasAdminRole()
        {
            var roleHeader = Request.Headers["X-User-Role"].FirstOrDefault();
            var queryRole = Request.Query["role"].FirstOrDefault();
            var role = roleHeader ?? queryRole;
            return !string.IsNullOrWhiteSpace(role) && role.Equals("ADMIN", StringComparison.OrdinalIgnoreCase);
        }
    }
}
