using API.Extensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args); //creates kestrel server

// Add services to the container.

builder.Services.AddControllers();
// Services have now been added to "Extensions" class
builder.Services.AddApplicationServices(builder.Configuration);

var app = builder.Build(); //builds the app

// Configure the HTTP request pipeline. (middleware)
if (app.Environment.IsDevelopment()) //applies middleware (controls api traffic in/out)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

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
