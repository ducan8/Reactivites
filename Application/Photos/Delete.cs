using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string publicId { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IPhoroAccessor _phoroAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhoroAccessor phoroAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _phoroAccessor = phoroAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if (user == null) { return null; }

                var photoNeedToDelete = user.Photos.FirstOrDefault(x => x.Id == request.publicId);

                if (photoNeedToDelete == null) { return null; }

                if (photoNeedToDelete.IsMain)
                {
                    return Result<Unit>.Failure("You cannot delete your main photo");
                }

                var result = await _phoroAccessor.DeletePhoto(photoNeedToDelete.Id);

                if(result == null) return Result<Unit>.Failure("Failed to delete the photo");

                user.Photos.Remove(photoNeedToDelete);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to delete the photo");
            }
        }
    }
}

