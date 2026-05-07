using Microsoft.AspNetCore.Mvc;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaterialsController : ControllerBase
    {
        private readonly IMaterialService _materialService;
        private readonly IFileService _fileService;
        private readonly ILogger<MaterialsController> _logger;

        public MaterialsController(IMaterialService materialService, IFileService fileService, ILogger<MaterialsController> logger)
        {
            _materialService = materialService;
            _fileService = fileService;
            _logger = logger;
        }

        /// <summary>
        /// Get all materials
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaterialResponseDto>>> GetAllMaterials()
        {
            try
            {
                var materials = await _materialService.GetAllMaterialsAsync();
                var response = materials.Select(m => new MaterialResponseDto
                {
                    Id = m.Id,
                    Title = m.Title,
                    ContentText = m.ContentText,
                    FileUrl = m.FileUrl,
                    UploaderId = m.UploaderId,
                    CreatedAt = m.CreatedAt
                });

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving materials");
                return StatusCode(500, new { error = "Error retrieving materials" });
            }
        }

        /// <summary>
        /// Get material by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<MaterialResponseDto>> GetMaterialById(int id)
        {
            try
            {
                var material = await _materialService.GetMaterialByIdAsync(id);
                if (material == null)
                    return NotFound(new { error = "Material not found" });

                var response = new MaterialResponseDto
                {
                    Id = material.Id,
                    Title = material.Title,
                    ContentText = material.ContentText,
                    FileUrl = material.FileUrl,
                    UploaderId = material.UploaderId,
                    CreatedAt = material.CreatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving material");
                return StatusCode(500, new { error = "Error retrieving material" });
            }
        }

        /// <summary>
        /// Upload a new material with file (PDF or DOCX)
        /// </summary>
        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<MaterialResponseDto>> UploadMaterial([FromForm] CreateMaterialDto request)
        {
            try
            {
                // Validate request
                if (string.IsNullOrWhiteSpace(request.Title))
                    return BadRequest(new { error = "Title is required" });

                if (request.File == null || request.File.Length == 0)
                    return BadRequest(new { error = "File is required" });

                if (request.UploaderId <= 0)
                    return BadRequest(new { error = "Valid UploaderId is required" });

                // Validate file type
                if (!_fileService.IsValidFileType(request.File.FileName))
                    return BadRequest(new { error = "Invalid file type. Only PDF and DOCX files are allowed." });

                // Validate file size (20MB max)
                if (!_fileService.IsValidFileSize(request.File.Length))
                    return BadRequest(new { error = "File size exceeds the maximum allowed size of 20MB." });

                // Upload file
                var uploadResult = await _fileService.UploadFileAsync(request.File, "uploads");
                if (!uploadResult.Success)
                    return BadRequest(new { error = uploadResult.Error });

                // Extract text from file
                var extractResult = await _fileService.ExtractTextFromFileAsync(uploadResult.FilePath!);
                if (!extractResult.Success)
                {
                    _logger.LogWarning($"Failed to extract text from {uploadResult.FilePath}: {extractResult.Error}");
                    // Continue anyway with the file path, just use title as content
                }

                // Create material entity
                var material = new Material
                {
                    Title = request.Title,
                    ContentText = extractResult.ExtractedText ?? request.Title,
                    FileUrl = uploadResult.FilePath,
                    UploaderId = request.UploaderId,
                    CreatedAt = DateTime.UtcNow
                };

                // Save to database
                await _materialService.CreateMaterialAsync(material);

                // Return response
                var response = new MaterialResponseDto
                {
                    Id = material.Id,
                    Title = material.Title,
                    ContentText = material.ContentText,
                    FileUrl = material.FileUrl,
                    UploaderId = material.UploaderId,
                    CreatedAt = material.CreatedAt
                };

                return CreatedAtAction(nameof(GetMaterialById), new { id = material.Id }, response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading material");
                return StatusCode(500, new { error = "Error uploading material", details = ex.Message });
            }
        }

        /// <summary>
        /// Update material
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMaterial(int id, [FromBody] CreateMaterialDto request)
        {
            try
            {
                var material = await _materialService.GetMaterialByIdAsync(id);
                if (material == null)
                    return NotFound(new { error = "Material not found" });

                material.Title = request.Title;
                await _materialService.UpdateMaterialAsync(material);

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating material");
                return StatusCode(500, new { error = "Error updating material" });
            }
        }

        /// <summary>
        /// Delete material by ID
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaterial(int id)
        {
            try
            {
                var material = await _materialService.GetMaterialByIdAsync(id);
                if (material == null)
                    return NotFound(new { error = "Material not found" });

                await _materialService.DeleteMaterialAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting material");
                return StatusCode(500, new { error = "Error deleting material" });
            }
        }
    }
}
