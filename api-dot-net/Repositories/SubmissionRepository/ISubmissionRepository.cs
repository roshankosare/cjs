using CjsApi.Models;

namespace CjsApi.Repositories.SubmissionRepository
{


    public interface ISubmissionRepository
    {
        Task<Submission> AddAsync(Submission submission);
        Task<Submission?> GetByIdAsync(int id);
        Task<List<Submission>> GetByUserAsync(int userId);
        // Task<List<Submission>> GetByProblemAsync(int problemId);
        Task UpdateStatusAsync(int submissionId, SubmissionStatus status);

        public Task<List<Submission>> GetByUserAndProblemAsync(
            int userId,
            int problemId);

        Task<int> CountAsync();

    }
}