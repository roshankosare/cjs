namespace CjsApi.Services.CodeExecution.Dto
{


    public class TestCaseDto(string input, string expectedOutput)
    {

        public string Input { get; set; } = input;
        public string ExpectedOutput { get; set; } = expectedOutput;
    }

}