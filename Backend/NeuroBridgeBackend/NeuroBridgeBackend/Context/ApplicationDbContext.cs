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
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Material> Materials { get; set; } = null!;
    public DbSet<Quiz> Quizzes { get; set; } = null!;
    public DbSet<Question> Questions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.Role);

            entity.Property(e => e.Email)
                .IsRequired();

            entity.Property(e => e.Role)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsRequired();

            entity.Property(e => e.MentorRating)
                .HasPrecision(3, 2);

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<Material>(entity =>
        {
            entity.Property(e => e.Title)
                .IsRequired();

            entity.Property(e => e.ContentText)
                .HasColumnType("nvarchar(max)")
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Uploader)
                .WithMany()
                .HasForeignKey(e => e.UploaderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.Property(e => e.Difficulty)
                .HasConversion<string>()
                .HasMaxLength(10)
                .IsRequired();

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20)
                .HasDefaultValue(QuizStatus.PENDING)
                .IsRequired();

            entity.HasOne(e => e.Material)
                .WithMany()
                .HasForeignKey(e => e.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.Property(e => e.QuestionText)
                .IsRequired();

            entity.Property(e => e.OptionsJson)
                .HasColumnType("nvarchar(max)")
                .IsRequired();

            entity.Ignore(e => e.Options);

            entity.HasOne(e => e.Quiz)
                .WithMany(q => q.Questions)
                .HasForeignKey(e => e.QuizId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        base.OnModelCreating(modelBuilder);
    }
}
