using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;
            public IMapper mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this.context.Activities.FindAsync(request.Activity.Id); //tracking this activity in memory

                // activity.Title = request.Activity.Title ?? activity.Title; // updates a single property -- WILL USE AUTOMAPPER
                this.mapper.Map(request.Activity, activity);

                await this.context.SaveChangesAsync(); //actual update

                return Unit.Value;
            }
        }
    }
}