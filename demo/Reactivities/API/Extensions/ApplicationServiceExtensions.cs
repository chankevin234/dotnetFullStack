using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    { //no need to create an instance of this class
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration config)
        {
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            //add the new db's context and connection
            services.AddDbContext<DataContext> (opt => 
                {
                    opt.UseSqlite(config.GetConnectionString("DefaultConnection"));
                }); //this uses the connection string

            services.AddCors(opt => 
                {
                    opt.AddPolicy("CorsPolicy", policy => 
                    {
                        policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
                    }); //policy to allow any http request to localhost 3000
                });

            services.AddMediatR(typeof(List.Handler)); //registers mediator handlers
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            return services;
        }        
    }
}