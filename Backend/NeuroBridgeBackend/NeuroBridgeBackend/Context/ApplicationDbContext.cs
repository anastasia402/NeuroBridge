using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Entities;

namespace NeuroBridgeBackend.Context;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<TestEntity> MyEntities { get; set; } = null!;
}
