using Application.Core;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<Activity>>> {} //mediator query

        public class Handler : IRequestHandler<Query, Result<List<Activity>>>
        {
            public DataContext Context;
            
            public Handler(DataContext context) 
            {
                this.Context = context;
            }

            public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken token)
            { //cancellation tokens cancel a request after time
                
                return Result<List<Activity>>.Success(await this.Context.Activities.ToListAsync(token));
            }
        }
    }
}