using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {
            public Activity Activiity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
        private readonly DataContext context;
            public Handler(DataContext context)
            {
                this.context = context;
                
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                this.context.Activities.Add(request.Activiity);

                await this.context.SaveChangesAsync(); 

                return Unit.Value;
            }
        }
    }
}