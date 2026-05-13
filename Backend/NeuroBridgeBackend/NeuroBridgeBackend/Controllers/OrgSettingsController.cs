using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Services.Interfaces;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    public class OrgSettingsController : ControllerBase
    {
        private readonly IOrgSettingsService _service;

        public OrgSettingsController(IOrgSettingsService service)
        {
            _service = service;
        }

        /// <summary>Public — frontend-ul îl apelează la load fără token.</summary>
        [HttpGet("api/settings/org")]
        [AllowAnonymous]
        public async Task<ActionResult<OrgSettingsResponse>> Get()
        {
            return Ok(await _service.GetAsync());
        }

        /// <summary>Admin only — actualizează setările organizației.</summary>
        [HttpPut("api/admin/settings")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<OrgSettingsResponse>> Update([FromBody] UpdateOrgSettingsRequest request)
        {
            try
            {
                var result = await _service.UpdateAsync(request);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
