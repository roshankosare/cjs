using CjsApi.Dto;
using CjsApi.Models;

namespace CjsApi.Services.ProblemService
{
    public interface IProblemService
    {

        public IQueryable<Problem> GetProblemsQueryable(
         Difficulty? difficulty,
         List<string>? tags,
         string? search = null
     );
        // Task<IEnumerable<Problem>> GetProblemsAsync(
        //     Difficulty? difficulty,
        //     List<string>? tags
        // );

        Task<Problem> GetProblemBySlugAsync(string slug);
        Task<Problem> GetProblemByIdAsync(int id);

        Task<int> CreateProblemAsync(CreateProblemDto createProblemDto);
        Task<bool> UpdateProblemAsync(int id, UpdateProblemDto updateProblemDto);
        Task DeleteProblemAsync(int id);
    }
}
