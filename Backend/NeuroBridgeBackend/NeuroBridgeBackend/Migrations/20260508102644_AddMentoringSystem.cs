using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuroBridgeBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddMentoringSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MentoringSessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    JuniorId = table.Column<int>(type: "int", nullable: false),
                    MentorId = table.Column<int>(type: "int", nullable: true),
                    Topic = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false, defaultValue: "PENDING"),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentoringSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MentoringSessions_Users_JuniorId",
                        column: x => x.JuniorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MentoringSessions_Users_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    MessageType = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false, defaultValue: "TEXT"),
                    SentAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    IsRead = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChatMessages_MentoringSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "MentoringSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChatMessages_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MentorFeedbacks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MentorId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comments = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    MentoringSessionId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MentorFeedbacks", x => x.Id);
                    table.CheckConstraint("CK_MentorFeedback_Rating", "Rating >= 1 AND Rating <= 5");
                    table.ForeignKey(
                        name: "FK_MentorFeedbacks_MentoringSessions_MentoringSessionId",
                        column: x => x.MentoringSessionId,
                        principalTable: "MentoringSessions",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MentorFeedbacks_MentoringSessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "MentoringSessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MentorFeedbacks_Users_MentorId",
                        column: x => x.MentorId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SenderId",
                table: "ChatMessages",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_SessionId",
                table: "ChatMessages",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorFeedbacks_MentorId",
                table: "MentorFeedbacks",
                column: "MentorId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorFeedbacks_MentoringSessionId",
                table: "MentorFeedbacks",
                column: "MentoringSessionId");

            migrationBuilder.CreateIndex(
                name: "IX_MentorFeedbacks_SessionId",
                table: "MentorFeedbacks",
                column: "SessionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MentoringSessions_JuniorId",
                table: "MentoringSessions",
                column: "JuniorId");

            migrationBuilder.CreateIndex(
                name: "IX_MentoringSessions_MentorId",
                table: "MentoringSessions",
                column: "MentorId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "MentorFeedbacks");

            migrationBuilder.DropTable(
                name: "MentoringSessions");
        }
    }
}
