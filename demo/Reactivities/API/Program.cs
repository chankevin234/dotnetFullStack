var builder = WebApplication.CreateBuilder(args); //creates kestrel server

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build(); //builds the app

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) //applies middleware (controls api traffic in/out)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.Run();
