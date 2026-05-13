using NeuroBridgeBackend.DTOs;
using NeuroBridgeBackend.Entities;
using NeuroBridgeBackend.Repositories.Interfaces;
using NeuroBridgeBackend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace NeuroBridgeBackend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IAuthRepository authRepository, ITokenService tokenService)
        {
            _authRepository = authRepository;
            _tokenService = tokenService;
        }

        public async Task<RegisterResponseDto> RegisterAsync(RegisterRequestDto request)
        {
            var existing = await _authRepository.GetByEmailAsync(request.Email);
            if (existing != null)
            {
                return new RegisterResponseDto
                {
                    Success = false,
                    Errors = new[] { "Email already in use." }
                };
            }

            var user = new User
            {
                UserName = request.Email,
                Email = request.Email,
                FullName = request.FullName,
                Role = request.Role?.ToUpper() switch
                {
                    "ADMIN" => UserRole.ADMIN,
                    "MENTOR" => UserRole.MENTOR,
                    _ => UserRole.JUNIOR
                }
            };

            var result = await _authRepository.CreateUserAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return new RegisterResponseDto
                {
                    Success = false,
                    Errors = result.Errors.Select(e => e.Description).ToArray()
                };
            }

            // Map role string to Identity role names used in seeding (Admin, Mentor, Junior)
            var identityRoleName = user.Role switch
            {
                UserRole.ADMIN => "Admin",
                UserRole.MENTOR => "Mentor",
                _ => "Junior"
            };

            var roleResult = await _authRepository.AddToRoleAsync(user, identityRoleName);
            if (!roleResult.Succeeded)
            {
                return new RegisterResponseDto
                {
                    Success = false,
                    Errors = roleResult.Errors.Select(e => e.Description).ToArray()
                };
            }

            return new RegisterResponseDto { Success = true };
        }

        public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
        {
            var user = await _authRepository.GetByEmailAsync(request.Email);
            if (user == null)
            {
                return new LoginResponseDto { Success = false, Errors = new[] { "Invalid credentials." } };
            }

            var valid = await _authRepository.CheckPasswordAsync(user, request.Password);
            if (!valid)
            {
                return new LoginResponseDto { Success = false, Errors = new[] { "Invalid credentials." } };
            }

            // get role name string for token
            var roleName = user.Role switch
            {
                UserRole.ADMIN => "Admin",
                UserRole.MENTOR => "Mentor",
                _ => "Junior"
            };

            var token = _tokenService.CreateToken(user, roleName);

            return new LoginResponseDto { Success = true, Token = token };
        }
    }
}
