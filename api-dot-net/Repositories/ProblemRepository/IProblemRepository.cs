using CjsApi.Models;

namespace CjsApi.Repositories.ProblemRepository
{
    public interface IProblemRepository
    {

        IQueryable<Problem> Query(
       bool onlyPublished,
       Difficulty? difficulty,
       List<string>? tags,
       string? search = null
   );

        Task<IEnumerable<Problem>> GetAllAsync(
            bool onlyPublished = true,
            Difficulty? difficulty = null,
            List<string>? tags = null,
            string? search = null
        );

        Task<Problem?> GetByIdAsync(int id);
        Task<Problem?> GetBySlugAsync(string slug);

        Task<Problem> CreateAsync(Problem problem);
        Task UpdateAsync(Problem problem);
        Task DeleteAsync(int id);

        Task<bool> ExistsBySlugAsync(string slug);

        Task<bool> ExistsByTitleAsync(string title);

        Task<Problem?> GetByIdWithRelationsAsync(int id);

        Task<int> CountAsync();
    }
}
