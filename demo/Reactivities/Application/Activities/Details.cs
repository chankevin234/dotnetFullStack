using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Activity> 
        {
            public Guid Id {get; set;}
        }

        public class Handler : IRequestHandler<Query, Activity>
        {
            public DataContext Context { get; }
            public Handler(DataContext context)
            {
                this.Context = context;
            }
            public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            {
                return await this.Context.Activities.FindAsync(request.Id);
            }
        }
    }
}