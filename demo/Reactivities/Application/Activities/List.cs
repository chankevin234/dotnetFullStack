using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> {} //mediator query

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            public DataContext Context;
            
            public Handler(DataContext context) 
            {
                this.Context = context;
            }

            public async Task<List<Activity>> Handle(Query request, CancellationToken token)
            { //cancellation tokens cancel a request after time
                
                return await this.Context.Activities.ToListAsync();
            }
        }
    }
}