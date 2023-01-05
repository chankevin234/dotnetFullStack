using MediatR;
using Microsoft.AspNetCore.Mvc;
using Application.Core;

namespace API.Controllers
{
    [ApiController] // this attribute will generate 400 error when data annotation is not met
    [Route("api/[controller]")] 
    public class BaseApiController : ControllerBase
    {
        private IMediator _mediator;

        //protected = only avail in this class or derived classes
        protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result) 
        {
            if (result == null) return NotFound();
            if (result.IsSuccess && result.Value != null) {
                return Ok(result.Value); //returns 200
            }
            if (result.IsSuccess && result.Value == null) {
                return NotFound(); //204 code
            }
            //else return error
            return BadRequest(result.Error);
        }
    }
}