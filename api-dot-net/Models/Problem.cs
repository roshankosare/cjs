namespace CjsApi.Models
{

    public enum Difficulty
    {
        EASY,
        MEDIUM,
        HARD
    }

    public class Problem
    {
        public int Id { get; set; }

        public string Title { get; set; } = null!;
        public string Slug { get; set; } = null!; // two-sum

        public string Description { get; set; } = null!; // markdown
        public Difficulty Difficulty { get; set; }

        public int TimeLimitMs { get; set; }
        public int MemoryLimitMb { get; set; }

        public bool IsPublished { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<TestCase> TestCases { get; set; } = new List<TestCase>();
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }


}