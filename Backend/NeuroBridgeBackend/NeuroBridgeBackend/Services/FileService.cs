using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using NeuroBridgeBackend.Services.Interfaces;

namespace NeuroBridgeBackend.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly string[] _allowedExtensions = { ".pdf", ".docx" };

        public FileService(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        public bool IsValidFileType(string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLower();
            return _allowedExtensions.Contains(extension);
        }

        public bool IsValidFileSize(long fileSizeBytes, long maxSizeBytes = 20 * 1024 * 1024)
        {
            return fileSizeBytes > 0 && fileSizeBytes <= maxSizeBytes;
        }

        public async Task<(bool Success, string? FilePath, string? Error)> UploadFileAsync(IFormFile file, string uploadDirectory)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return (false, null, "File is empty");

                if (!IsValidFileType(file.FileName))
                    return (false, null, "Invalid file type. Only PDF and DOCX files are allowed.");

                if (!IsValidFileSize(file.Length))
                    return (false, null, $"File size exceeds the maximum allowed size of 20MB.");

                // Create uploads directory if it doesn't exist
                var uploadsPath = Path.Combine(_webHostEnvironment.WebRootPath ?? Directory.GetCurrentDirectory(), uploadDirectory);
                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Return relative path for database storage
                var relativePath = Path.Combine(uploadDirectory, fileName).Replace("\\", "/");
                return (true, relativePath, null);
            }
            catch (Exception ex)
            {
                return (false, null, $"Error uploading file: {ex.Message}");
            }
        }

        public async Task<(bool Success, string? ExtractedText, string? Error)> ExtractTextFromFileAsync(string filePath)
        {
            try
            {
                var fullPath = Path.Combine(
                    _webHostEnvironment.WebRootPath ?? Directory.GetCurrentDirectory(),
                    filePath);

                if (!File.Exists(fullPath))
                    return (false, null, "File not found");

                var extension = Path.GetExtension(filePath).ToLower();

                return extension switch
                {
                    ".pdf" => await ExtractTextFromPdfAsync(fullPath),
                    ".docx" => await ExtractTextFromDocxAsync(fullPath),
                    _ => (false, null, "Unsupported file type for text extraction")
                };
            }
            catch (Exception ex)
            {
                return (false, null, $"Error extracting text: {ex.Message}");
            }
        }

        private async Task<(bool Success, string? ExtractedText, string? Error)> ExtractTextFromPdfAsync(string filePath)
        {
            try
            {
                var text = new StringBuilder();

                using (var pdfDocument = new PdfDocument(new PdfReader(filePath)))
                {
                    for (int i = 1; i <= pdfDocument.GetNumberOfPages(); i++)
                    {
                        var page = pdfDocument.GetPage(i);
                        var strategy = new SimpleTextExtractionStrategy();
                        text.Append(PdfTextExtractor.GetTextFromPage(page, strategy));
                        text.AppendLine();
                    }
                }

                return await Task.FromResult<(bool, string?, string?)>((true, text.ToString(), null));
            }
            catch (Exception ex)
            {
                return (false, null, $"Error extracting PDF text: {ex.Message}");
            }
        }

        private async Task<(bool Success, string? ExtractedText, string? Error)> ExtractTextFromDocxAsync(string filePath)
        {
            try
            {
                var text = new StringBuilder();

                // Using DocumentFormat.OpenXml to extract text from DOCX
                using (var wordprocessingDocument = DocumentFormat.OpenXml.Packaging.WordprocessingDocument.Open(filePath, false))
                {
                    if (wordprocessingDocument.MainDocumentPart?.Document?.Body != null)
                    {
                        foreach (var paragraph in wordprocessingDocument.MainDocumentPart.Document.Body.Descendants<DocumentFormat.OpenXml.Wordprocessing.Paragraph>())
                        {
                            foreach (var run in paragraph.Descendants<DocumentFormat.OpenXml.Wordprocessing.Run>())
                            {
                                foreach (var textElement in run.Descendants<DocumentFormat.OpenXml.Wordprocessing.Text>())
                                {
                                    text.Append(textElement.Text);
                                }
                            }
                            text.AppendLine();
                        }
                    }
                }

                return await Task.FromResult<(bool, string?, string?)>((true, text.ToString(), null));
            }
            catch (Exception ex)
            {
                return (false, null, $"Error extracting DOCX text: {ex.Message}");
            }
        }
    }
}
