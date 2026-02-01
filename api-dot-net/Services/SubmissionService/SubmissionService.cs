using CjsApi.Dto;
using CjsApi.Models;
using CjsApi.Repositories.SubmissionRepository;

public class SubmissionService
{
    private readonly ISubmissionRepository _repo;

    public SubmissionService(ISubmissionRepository repo)
    {
        _repo = repo;
    }

    public async Task<Submission> CreateSubmissionAsync(
        int userId, int problemId, string code, string language)
    {
        var submission = new Submission
        {
            UserId = userId,
            ProblemId = problemId,
            Code = code,
            Language = language,
            Status = SubmissionStatus.PENDING
        };

        return await _repo.AddAsync(submission);
    }

    public async Task UpdateResultAsync(
        int submissionId,
        SubmissionStatus status,
        int timeMs,
        int memoryKb)
    {
        await _repo.UpdateStatusAsync(submissionId, status);
        // you can extend this to update time & memory
    }


    public async Task<List<ProblemSubmissionDetails>>
GetProblemSubmissionsAsync(int userId, int problemId)
    {
        var submissions = await _repo
            .GetByUserAndProblemAsync(userId, problemId);

        return submissions
            .OrderByDescending(s => s.SubmittedAt)
            .Select(s => new ProblemSubmissionDetails
            {
                Title = s.Problem.Title,
                Status = s.Status,
                Language = s.Language,
                Difficulty = s.Problem.Difficulty
            })
            .ToList();
    }
}
