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
    public DbSet<UserGroup> UserGroups { get; set; } = null!;
    public DbSet<MaterialAssignment> MaterialAssignments { get; set; } = null!;
    public DbSet<MentoringSession> MentoringSessions { get; set; } = null!;
    public DbSet<ChatMessage> ChatMessages { get; set; } = null!;
    public DbSet<MentorFeedback> MentorFeedbacks { get; set; } = null!;

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

        modelBuilder.Entity<MaterialAssignment>(entity =>
        {
            entity.Property(e => e.AssignedRole)
                .HasMaxLength(50);

            entity.HasOne(e => e.Material)
                .WithMany(m => m.Assignments)
                .HasForeignKey(e => e.MaterialId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.UserGroup)
                .WithMany(g => g.MaterialAssignments)
                .HasForeignKey(e => e.UserGroupId)
                .OnDelete(DeleteBehavior.Restrict);
        });

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

            entity.HasOne(e => e.UserGroup)
                .WithMany(g => g.Users)
                .HasForeignKey(e => e.UserGroupId)
                .OnDelete(DeleteBehavior.SetNull);
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

        modelBuilder.Entity<MentoringSession>(entity =>
        {
            entity.Property(e => e.Id)
                .ValueGeneratedNever(); // UUID is generated in code

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(15)
                .HasDefaultValue(MentoringSessionStatus.PENDING)
                .IsRequired();

            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Junior)
                .WithMany()
                .HasForeignKey(e => e.JuniorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(e => e.Mentor)
                .WithMany()
                .HasForeignKey(e => e.MentorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ChatMessage>(entity =>
        {
            entity.Property(e => e.MessageType)
                .HasConversion<string>()
                .HasMaxLength(10)
                .HasDefaultValue(ChatMessageType.TEXT)
                .IsRequired();

            entity.Property(e => e.SentAt)
                .HasDefaultValueSql("GETUTCDATE()");

            entity.HasOne(e => e.Session)
                .WithMany(s => s.ChatMessages)
                .HasForeignKey(e => e.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Sender)
                .WithMany()
                .HasForeignKey(e => e.SenderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<MentorFeedback>(entity =>
        {
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("GETUTCDATE()");

            // CHECK constraint for rating (1-5)
            entity.ToTable(t => t.HasCheckConstraint("CK_MentorFeedback_Rating", "Rating >= 1 AND Rating <= 5"));

            entity.HasOne(e => e.Session)
                .WithOne(s => s.Feedback)
                .HasForeignKey<MentorFeedback>(e => e.SessionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Mentor)
                .WithMany()
                .HasForeignKey(e => e.MentorId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }
}
