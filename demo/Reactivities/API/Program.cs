using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args); //creates kestrel server

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DataContext> (opt => 
{
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
}); //this uses the connection string

var app = builder.Build(); //builds the app

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) //applies middleware (controls api traffic in/out)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

// Get access to a service (scopes)
using var scope = app.Services.CreateScope(); //"using" means this is temp
var services = scope.ServiceProvider; 

try
{
    var context = services.GetRequiredService<DataContext>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred in migration");
}


app.Run();
