using CjsApi.Dto.ResponseDto;

namespace CjsApi.Services.CodeExecution.Dto
{

    public class CodeExecutionResult
    {
        public string Output { get; set; } = string.Empty;
        public string Error { get; set; } = string.Empty;
        public int ExitCode { get; set; }
        public bool TimedOut { get; set; }

        public List<TestCaseResultDto> TestCaseResults {get;set;} = new();
    }
}