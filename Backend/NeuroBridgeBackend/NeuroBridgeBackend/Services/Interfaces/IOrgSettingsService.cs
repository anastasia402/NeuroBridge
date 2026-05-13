using NeuroBridgeBackend.DTOs;

namespace NeuroBridgeBackend.Services.Interfaces
{
    public interface IOrgSettingsService
    {
        Task<OrgSettingsResponse> GetAsync();
        Task<OrgSettingsResponse> UpdateAsync(UpdateOrgSettingsRequest request);
    }
}
