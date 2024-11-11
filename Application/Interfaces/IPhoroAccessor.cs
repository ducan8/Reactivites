using Application.Photos;
using Microsoft.AspNetCore.Http;


namespace Application.Interfaces
{
    public interface IPhoroAccessor
    {
        Task<PhotoUploadResult> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}
