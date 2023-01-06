using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>> 
        {
            public Guid Id {get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            public DataContext Context { get; }
            public Handler(DataContext context)
            {
                this.Context = context;
            }
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await this.Context.Activities.FindAsync(request.Id);

                return Result<Activity>.Success(activity);
            }
        }
    }
}