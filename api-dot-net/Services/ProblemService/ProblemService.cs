using CjsApi.Dto;
using CjsApi.Models;
using CjsApi.Repositories.ProblemRepository;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace CjsApi.Services.ProblemService
{
    public class ProblemService : IProblemService
    {
        private readonly IProblemRepository _problemRepository;

        public ProblemService(IProblemRepository problemRepository)
        {
            _problemRepository = problemRepository;
        }

        /* -------------------- READ -------------------- */

        public IQueryable<Problem> GetProblemsQueryable(
            Difficulty? difficulty,
            List<string>? tags,
            string? search = null // Optional
        )
        {
            return _problemRepository.Query(
                onlyPublished: true,
                difficulty: difficulty,
                tags: tags,
                search: search
            );
        }

        public async Task<Problem?> GetProblemBySlugAsync(string slug)
        {
            return await _problemRepository.GetBySlugAsync(slug);
        }

        public async Task<Problem?> GetProblemByIdAsync(int id)
        {
            return await _problemRepository.GetByIdAsync(id);
        }




        /* -------------------- CREATE -------------------- */

        public async Task<int> CreateProblemAsync(CreateProblemDto dto)
        {
            // 🚫 Enforce unique title (fail fast)
            if (await _problemRepository.ExistsByTitleAsync(dto.Title))
            {
                throw new InvalidOperationException("Problem title already exists");
            }

            // ✅ Inline slug generation
            var slug = Regex.Replace(
                dto.Title.ToLowerInvariant(),
                @"[^a-z0-9]+",
                "-"
            ).Trim('-');

            var problem = new Problem
            {
                Title = dto.Title,
                Slug = slug,
                Description = dto.Description,
                Difficulty = dto.Difficulty,
                TimeLimitMs = dto.TimeLimitMs,
                MemoryLimitMb = dto.MemoryLimitMb,
                IsPublished = dto.IsPublished,
                CreatedAt = DateTime.UtcNow
            };

            // Test cases
            foreach (var tc in dto.TestCases)
            {
                Console.WriteLine($"Adding test case: Input={tc.Input}, Output={tc.Output}, IsSample={tc.Sample}");
                problem.TestCases.Add(new TestCase
                {
                    Input = tc.Input,
                    ExpectedOutput = tc.Output,
                    IsSample = tc.Sample
                });
            }

            // Tags
            foreach (var tagName in dto.Tags.Distinct())
            {
                problem.ProblemTags.Add(new ProblemTag
                {
                    Tag = new Tag { Name = tagName }
                });
            }

            await _problemRepository.CreateAsync(problem);
            return problem.Id;
        }

        /* -------------------- UPDATE -------------------- */

        public async Task<bool> UpdateProblemAsync(int id, UpdateProblemDto dto)
        {
            var problem = await _problemRepository.GetByIdWithRelationsAsync(id);

            if (problem == null)
                return false;

            // 🚫 Prevent title collision
            if (problem.Title != dto.Title &&
                await _problemRepository.ExistsByTitleAsync(dto.Title))
            {
                throw new InvalidOperationException("Problem title already exists");
            }

            problem.Title = dto.Title;
            problem.Description = dto.Description;
            problem.Difficulty = dto.Difficulty;
            problem.TimeLimitMs = dto.TimeLimitMs;
            problem.MemoryLimitMb = dto.MemoryLimitMb;
            problem.IsPublished = dto.IsPublished;
            problem.UpdatedAt = DateTime.UtcNow;

            // Replace test cases
            problem.TestCases.Clear();
            foreach (var tc in dto.TestCases)
            {
                Console.WriteLine($"Adding test case: Input={tc.Input}, Output={tc.Output}, IsSample={tc.Sample}");
                problem.TestCases.Add(new TestCase
                {
                    Input = tc.Input,
                    ExpectedOutput = tc.Output,
                    IsSample = tc.Sample
                });
            }

            // Replace tags
            problem.ProblemTags.Clear();
            foreach (var tagName in dto.Tags.Distinct())
            {
                problem.ProblemTags.Add(new ProblemTag
                {
                    Tag = new Tag { Name = tagName }
                });
            }

            await _problemRepository.UpdateAsync(problem);
            return true;
        }

        /* -------------------- DELETE -------------------- */

        public async Task DeleteProblemAsync(int id)
        {
            await _problemRepository.DeleteAsync(id);
        }
    }
}
