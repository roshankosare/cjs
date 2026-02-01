using Microsoft.EntityFrameworkCore;
using CjsApi.Data;
using CjsApi.Models;

namespace CjsApi.Repositories.ProblemRepository
{
    public class ProblemRepository : IProblemRepository
    {
        private readonly AppDbContext _context;

        public ProblemRepository(AppDbContext context)
        {
            _context = context;
        }


        public IQueryable<Problem> Query(
    bool onlyPublished,
    Difficulty? difficulty,
    List<string>? tags,
    string? search = null
)
        {
            var query = _context.Problems
                .Include(p => p.ProblemTags)
                .AsQueryable();

            if (onlyPublished)
                query = query.Where(p => p.IsPublished);

            if (difficulty != null)
                query = query.Where(p => p.Difficulty == difficulty);

            if (tags != null && tags.Any())
                query = query.Where(p =>
                    p.ProblemTags.Any(pt => tags.Contains(pt.Tag.Name))
                );

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.ToLower();
                query = query.Where(p => p.Title.ToLower().Contains(search) || p.Slug.ToLower().Contains(search));
            }

            return query;
        }


        public async Task<IEnumerable<Problem>> GetAllAsync(
            bool onlyPublished = true,
            Difficulty? difficulty = null,
            List<string>? tags = null,
            string? search = null
        )
        {
            IQueryable<Problem> query = _context.Problems
                .Include(p => p.ProblemTags)
                    .ThenInclude(pt => pt.Tag);

            if (onlyPublished)
                query = query.Where(p => p.IsPublished);

            if (difficulty.HasValue)
                query = query.Where(p => p.Difficulty == difficulty.Value);

            if (tags != null && tags.Any())
            {
                query = query.Where(p =>
                    p.ProblemTags.Any(pt => tags.Contains(pt.Tag.Name))
                );
            }

            return await query
                .OrderByDescending(p => p.CreatedAt)
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task<Problem?> GetByIdAsync(int id)
        {
            return await _context.Problems
                .Include(p => p.TestCases)
                .Include(p => p.ProblemTags)
                    .ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.Id == id);
        }


        public async Task<Problem?> GetBySlugAsync(string slug)
        {
            return await _context.Problems
                .Include(p => p.TestCases) // 🔥 load all test cases
                .Include(p => p.ProblemTags)
                    .ThenInclude(pt => pt.Tag)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == slug && p.IsPublished);
        }



        public async Task<bool> ExistsByTitleAsync(string title)
        {
            return await _context.Problems
                .AsNoTracking()
                .AnyAsync(p => p.Title == title);
        }


        public async Task<Problem?> GetByIdWithRelationsAsync(int id)
        {
            return await _context.Problems
                .Include(p => p.TestCases)
                .Include(p => p.ProblemTags)
                    .ThenInclude(pt => pt.Tag)
                .FirstOrDefaultAsync(p => p.Id == id);
        }



        public async Task<Problem> CreateAsync(Problem problem)
        {
            _context.Problems.Add(problem);
            await _context.SaveChangesAsync();
            return problem;
        }


        public async Task UpdateAsync(Problem problem)
        {
            problem.UpdatedAt = DateTime.UtcNow;
            _context.Problems.Update(problem);
            await _context.SaveChangesAsync();
        }


        public async Task DeleteAsync(int id)
        {
            var problem = await _context.Problems.FindAsync(id);
            if (problem == null) return;

            _context.Problems.Remove(problem);
            await _context.SaveChangesAsync();
        }

        // 🔎 Check slug uniqueness
        public async Task<bool> ExistsBySlugAsync(string slug)
        {
            return await _context.Problems.AnyAsync(p => p.Slug == slug);
        }
        public async Task<int> CountAsync()
        {
            return await _context.Problems.CountAsync();
        }
    }
}
