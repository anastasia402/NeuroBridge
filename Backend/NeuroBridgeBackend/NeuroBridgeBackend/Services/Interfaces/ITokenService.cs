using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(User user, string role);
    }
}
