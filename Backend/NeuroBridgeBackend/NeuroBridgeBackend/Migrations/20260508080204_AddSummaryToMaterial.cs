using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NeuroBridgeBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddSummaryToMaterial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "Materials",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Summary",
                table: "Materials");
        }
    }
}
