
namespace CjsApi.Services.CodeExecution.Dto
{



    public class TestCaseResultDto
    {
        public int Index { get; set; }
        public string Input { get; set; } = "";
        public string Output { get; set; } = "";
        public string Expected { get; set; } = "";
        public bool Passed { get; set; }
    }

}