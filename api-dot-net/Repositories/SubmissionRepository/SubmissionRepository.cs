using CjsApi.Data;
using CjsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CjsApi.Repositories.SubmissionRepository
{


    public class SubmissionRepository : ISubmissionRepository
    {
        private readonly AppDbContext _context;

        public SubmissionRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Submission> AddAsync(Submission submission)
        {
            _context.Submissions.Add(submission);
            await _context.SaveChangesAsync();
            return submission;
        }

        public Task<Submission?> GetByIdAsync(int id)
            => _context.Submissions
                .Include(s => s.Problem)
                .Include(s => s.User)
                .FirstOrDefaultAsync(s => s.Id == id);

        public Task<List<Submission>> GetByUserAsync(int userId)
        => _context.Submissions
            .Where(s => s.UserId == userId)
            .Include(s => s.Problem)
            .OrderByDescending(s => s.SubmittedAt)
            .GroupBy(s => s.ProblemId)
            .Select(g => g.First())
            .Take(5)                // ✅ only latest 5
            .ToListAsync();

        public async Task UpdateStatusAsync(int submissionId, SubmissionStatus status)
        {
            var submission = await _context.Submissions.FindAsync(submissionId);
            if (submission == null) return;

            submission.Status = status;
            await _context.SaveChangesAsync();
        }


        public async Task<List<Submission>> GetByUserAndProblemAsync(
            int userId,
            int problemId)
        {
            return await _context.Submissions
    .Include(s => s.Problem)
    .Where(s => s.UserId == userId && s.ProblemId == problemId)
    .ToListAsync();

        }

        public Task<int> CountAsync()
        {
            return _context.Submissions.CountAsync();
        }

    }

}