using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        public DataContext Context { get; }
        public ActivitiesController(DataContext context)
        {
            this.Context = context;
            
        }

        [HttpGet] //api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities() 
        {
            return await this.Context.Activities.ToListAsync();
        }

        [HttpGet("{id}")] //api/activities/asdf
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
        {
            return await this.Context.Activities.FindAsync(id);
        }
        
    }
}