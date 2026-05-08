using NeuroBridgeBackend.DTOs;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IAIService
    {
        Task<GenerateQuizResponse> GenerateQuizAsync(GenerateQuizRequest request);
        Task<SummarizeResponse> SummarizeContentAsync(SummarizeRequest request);
    }
}
