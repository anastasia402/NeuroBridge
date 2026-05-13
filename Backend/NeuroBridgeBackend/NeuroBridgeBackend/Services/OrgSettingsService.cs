using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Services.Interfaces;
using System.Text.RegularExpressions;

namespace NeuroBridgeBackend.Services
{
    public class OrgSettingsService : IOrgSettingsService
    {
        private readonly ApplicationDbContext _context;

        private static readonly Dictionary<string, string> Defaults = new()
        {
            ["organization_name"] = "NeuroBridge",
            ["primary_color"]     = "#111827",
            ["logo_url"]          = "",
            ["welcome_message"]   = "Welcome to NeuroBridge"
        };

        public OrgSettingsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<OrgSettingsResponse> GetAsync()
        {
            var settings = await _context.OrganizationSettings.ToDictionaryAsync(s => s.Key, s => s.Value);

            return new OrgSettingsResponse
            {
                OrganizationName = settings.GetValueOrDefault("organization_name", Defaults["organization_name"]),
                PrimaryColor     = settings.GetValueOrDefault("primary_color",     Defaults["primary_color"]),
                LogoUrl          = settings.GetValueOrDefault("logo_url",          Defaults["logo_url"]),
                WelcomeMessage   = settings.GetValueOrDefault("welcome_message",   Defaults["welcome_message"])
            };
        }

        public async Task<OrgSettingsResponse> UpdateAsync(UpdateOrgSettingsRequest request)
        {
            if (request.PrimaryColor != null && !Regex.IsMatch(request.PrimaryColor, @"^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$"))
                throw new ArgumentException("primary_color trebuie să fie un hex valid (ex: #fff sau #1a2b3c).");

            if (request.LogoUrl != null && request.LogoUrl != "" && !Uri.TryCreate(request.LogoUrl, UriKind.Absolute, out _))
                throw new ArgumentException("logo_url trebuie să fie un URL valid.");

            var updates = new Dictionary<string, string?> {
                ["organization_name"] = request.OrganizationName,
                ["primary_color"]     = request.PrimaryColor,
                ["logo_url"]          = request.LogoUrl,
                ["welcome_message"]   = request.WelcomeMessage
            };

            foreach (var (key, value) in updates)
            {
                if (value == null) continue;

                var existing = await _context.OrganizationSettings.FindAsync(key);
                if (existing != null)
                {
                    existing.Value = value;
                    existing.UpdatedAt = DateTime.UtcNow;
                }
                else
                {
                    _context.OrganizationSettings.Add(new OrganizationSetting { Key = key, Value = value });
                }
            }

            await _context.SaveChangesAsync();
            return await GetAsync();
        }
    }
}
