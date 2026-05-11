using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.Context 
{
    public static class DbInitializer
    {
        public static async Task SeedDataAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await context.Database.MigrateAsync();

            string[] roles = { "Admin", "Mentor", "Junior" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            if (context.Users.Any()) return;

            var admin = new User { UserName = "admin@neurobridge.com", Email = "admin@neurobridge.com", FullName = "System Admin" };
            await userManager.CreateAsync(admin, "Password123!");
            await userManager.AddToRoleAsync(admin, "Admin");

            var mentors = new List<User>
            {
                new User { UserName = "aris@neurobridge.com", Email = "aris@neurobridge.com", FullName = "Dr. Aris Thorne", Level = 50, ExperiencePoints = 5200 },
                new User { UserName = "sarah@neurobridge.com", Email = "sarah@neurobridge.com", FullName = "Sarah Jenkins", Level = 45, ExperiencePoints = 4850 },
                new User { UserName = "chen@neurobridge.com", Email = "chen@neurobridge.com", FullName = "Prof. Chen", Level = 40, ExperiencePoints = 4100 }
            };

            foreach (var mentor in mentors)
            {
                await userManager.CreateAsync(mentor, "Password123!");
                await userManager.AddToRoleAsync(mentor, "Mentor");
            }

            var alex = new User { UserName = "alex@neurobridge.com", Email = "alex@neurobridge.com", FullName = "Alex (You)", Level = 12, ExperiencePoints = 1240, CurrentStreak = 42 };
            await userManager.CreateAsync(alex, "Password123!");
            await userManager.AddToRoleAsync(alex, "Junior");

            for (int i = 1; i <= 4; i++)
            {
                var junior = new User { UserName = $"junior{i}@neurobridge.com", Email = $"junior{i}@neurobridge.com", FullName = $"Junior {i}", Level = 5 + i };
                await userManager.CreateAsync(junior, "Password123!");
                await userManager.AddToRoleAsync(junior, "Junior");
            }

            var session = new MentoringSession
            {
                Id = Guid.NewGuid(),
                JuniorId = alex.Id,
                MentorId = mentors[0].Id,
                IssueDescription = "I'm having trouble understanding how Spaced Repetition handles critical failure points.",
                Status = MentoringSessionStatus.COMPLETED,
                CreatedAt = DateTime.UtcNow.AddDays(-1),
                CompletedAt = DateTime.UtcNow.AddDays(-1).AddMinutes(15)
            };
            context.MentoringSessions.Add(session);

            await context.SaveChangesAsync();
        }
    }
}