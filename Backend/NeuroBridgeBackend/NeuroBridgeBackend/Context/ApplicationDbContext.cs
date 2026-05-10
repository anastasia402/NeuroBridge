using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Models; 
using NeuroBridgeBackend.Entities; 

namespace NeuroBridgeBackend.Context;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<MentoringSession> MentoringSessions { get; set; } = null!;

    public DbSet<TestEntity> MyEntities { get; set; } = null!;
}