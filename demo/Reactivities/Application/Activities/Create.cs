using Application.Core;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        //used in ActivitiesController.cs
        public class Command : IRequest<Result<Unit>> // "unit" comes from MediatR as "returns nothing" 
        {
            public Activity Activity { get; set; }
        }

        // uses the fluent validator class
        public class CommandValidator : AbstractValidator<Command> 
        {
            public CommandValidator() //constructor 
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }


        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
        private readonly DataContext context;
            public Handler(DataContext context)
            {
                this.context = context;
                
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                this.context.Activities.Add(request.Activity);

                var result = await this.context.SaveChangesAsync() > 0;

                if (!result) {
                    return Result<Unit>.Failure("Failed to create activity");
                } 

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}