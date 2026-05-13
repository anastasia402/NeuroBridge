using NeuroBridgeBackend.DTOs;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IAuthService
    {
        Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request);
        Task<LoginResponseDto> LoginAsync(LoginRequestDto request);
    }
}
