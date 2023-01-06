using Application.Activities;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        // private readonly IMediator mediator;
        // public ActivitiesController(IMediator mediator)
        // {
        //     this.mediator = mediator;
            
        // }

        [HttpGet] //api/activities
        public async Task<IActionResult> GetActivities() 
        {
            return HandleResult(await Mediator.Send(new List.Query())); //"List" is a .cs file from Application/Activities
        }

        // [Authorize] // this means you are using the authentication service (not necessary now)
        [HttpGet("{id}")] //api/activities/<activity id>
        public async Task<ActionResult<Activity>> GetActivity(Guid id) 
        {
            // inherited from base api controller
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost] //Post
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Activity = activity}));
        } 
        
        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity) 
        {
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Activity =  activity}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

    }
}