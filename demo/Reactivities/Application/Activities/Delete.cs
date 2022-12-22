using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id {get; set;}
        }

        public class Handler : IRequestHandler<Command>
        {
            public DataContext Context;
            public Handler(DataContext context)
            {
                this.Context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this.Context.Activities.FindAsync(request.Id);

                this.Context.Remove(activity); //removes from memory

                await this.Context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}