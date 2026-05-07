using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IFileService
    {
        Task<(bool Success, string? FilePath, string? Error)> UploadFileAsync(IFormFile file, string uploadDirectory);
        Task<(bool Success, string? ExtractedText, string? Error)> ExtractTextFromFileAsync(string filePath);
        bool IsValidFileType(string fileName);
        bool IsValidFileSize(long fileSizeBytes, long maxSizeBytes = 20 * 1024 * 1024);
    }
}
