namespace CjsApi.Services.CodeExecution.Dto
{

    public class CodeExecutionRequest
    {
        public string Language { get; set; } = string.Empty;
        public string SourceCode { get; set; } = string.Empty;
        public string? Input { get; set; }
        public int TimeLimitMs { get; set; } = 2000;
        public int MemoryLimitMb { get; set; } = 256;
        public List<TestCaseDto> TestCases { get; set; } = new();
    }
}