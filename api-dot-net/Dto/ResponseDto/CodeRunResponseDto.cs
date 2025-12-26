
namespace CjsApi.Dto.ResponseDto
{

    public sealed class TestCaseResult
    {
        public int TestCaseNumber { get; set; }

        public bool Passed { get; set; }

        public string? ActualOutput { get; set; }

        public string? ExpectedOutput { get; set; }

        public string? Error { get; set; }
    }


    public sealed class CodeRunResponseDto
    {
        public bool Success => TestCases.All(tc => tc.Passed);

        public List<TestCaseResult> TestCases { get; set; } = new();

        public string? CompilationError { get; set; }

        public string? RuntimeError { get; set; }
    }
}