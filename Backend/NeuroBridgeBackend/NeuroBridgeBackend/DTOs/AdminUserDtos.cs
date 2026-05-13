using System.ComponentModel.DataAnnotations;

namespace NeuroBridgeBackend.DTOs
{
    public class AdminUserDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Role { get; set; } = null!;
        public int Level { get; set; }
        public int ExperiencePoints { get; set; }
        public int CurrentStreak { get; set; }
        public decimal? MentorRating { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; }
    }

    public class AdminUsersPagedResponse
    {
        public List<AdminUserDto> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    }

    public class CreateUserRequest
    {
        [Required, MaxLength(100)]
        public string FullName { get; set; } = null!;

        [Required, EmailAddress]
        public string Email { get; set; } = null!;

        [Required, MinLength(8)]
        public string Password { get; set; } = null!;

        [Required]
        public string Role { get; set; } = "Junior";
    }

    public class ChangeRoleRequest
    {
        [Required]
        public string Role { get; set; } = null!;
    }

    public class UserProgressDto
    {
        public int UserId { get; set; }
        public string FullName { get; set; } = null!;
        public int Level { get; set; }
        public int ExperiencePoints { get; set; }
        public int CurrentStreak { get; set; }
        public int TotalQuizzesTaken { get; set; }
        public double AverageScore { get; set; }
        public int CompletedSessions { get; set; }
        public List<QuizResultSummary> RecentQuizzes { get; set; } = new();
    }

    public class QuizResultSummary
    {
        public int Score { get; set; }
        public int TotalQuestions { get; set; }
        public int Percentage { get; set; }
        public DateTime CompletedAt { get; set; }
        public string? MaterialTitle { get; set; }
    }
}
