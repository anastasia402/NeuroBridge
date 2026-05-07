using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using NeuroBridgeBackend.Context;
using NeuroBridgeBackend.Repositories;
using NeuroBridgeBackend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Configure Entity Framework DbContext using the connection string from appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddRepositories();
builder.Services.AddServices();

// Configure file upload limits (20MB)
builder.Services.Configure<IISServerOptions>(options =>
{
    options.MaxRequestBodySize = 20 * 1024 * 1024; // 20MB
});

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = 20 * 1024 * 1024; // 20MB
    options.MultipartBodyLengthLimit = 20 * 1024 * 1024; // 20MB
});

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Create uploads directory
var uploadsPath = Path.Combine(app.Environment.WebRootPath ?? Directory.GetCurrentDirectory(), "uploads");
if (!Directory.Exists(uploadsPath))
    Directory.CreateDirectory(uploadsPath);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Serve static files from wwwroot
app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.Run();
