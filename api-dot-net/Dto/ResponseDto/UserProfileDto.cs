using System.Text.Json.Serialization;
using CjsApi.Models;

namespace CjsApi.Dto
{

    public class ProblemSubmissionDetails
    {
        public string Title { get; set; } = string.Empty;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SubmissionStatus Status { get; set; } = SubmissionStatus.PENDING;

        public string Language {get;set;} = string.Empty;
        
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Difficulty Difficulty { get; set; } = Difficulty.MEDIUM;
    }

    public class UserProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string About { get; set; } = string.Empty;

        public int SolvedCount { get; set; }
        public int EasyCount { get; set; }
        public int MediumCount { get; set; }
        public int HardCount { get; set; }

        public List<ProblemSubmissionDetails> LatestSubmissions { get; set; }
            = new();
    }
}