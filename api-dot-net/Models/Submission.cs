namespace CjsApi.Models
{


    public enum SubmissionStatus
    {
        PENDING,
        RUNNING,
        ACCEPTED,
        WRONG_ANSWER,
        TIME_LIMIT_EXCEEDED,
        RUNTIME_ERROR,
        COMPILATION_ERROR
    }

    public class Submission
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public int ProblemId { get; set; }
        public Problem Problem { get; set; } = null!;

        public string Language { get; set; } = null!; // cpp, java, python
        public string Code { get; set; } = null!;

        public SubmissionStatus Status { get; set; }

        public int ExecutionTimeMs { get; set; }
        public int MemoryUsedKb { get; set; }

        public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;
    }

    // public class ExecutionResult
    // {
    //     public int SubmissionId { get; set; }
    //     public string Logs { get; set; } = null!;
    // }

}