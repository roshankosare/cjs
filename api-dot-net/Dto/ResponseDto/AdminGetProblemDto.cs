using System.Text.Json.Serialization;
using CjsApi.Models;

namespace CjsApi.Dto
{
    public class TestCaseDto
    {
        public string Input { get; set; } = string.Empty;
        public string Output { get; set; } = string.Empty;

        public bool Sample {get;set;} = false;
    }

    public class AdminGetProblemDto
    {
        public string Title { get; set; } = string.Empty;

        public int Id { get; set; } = 1;
        public string Description { get; set; } = string.Empty;

        public List<TestCaseDto> TestCases { get; set; }
            = new List<TestCaseDto>();

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Difficulty Difficulty { get; set; } = Difficulty.EASY;

        public List<string> Tags { get; set; } = new();
    }
}
