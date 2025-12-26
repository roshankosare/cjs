
namespace CjsApi.Dto.RequestDto
{

    public class CodeRunRequestDto
    {

        public string Language { get; set; } = string.Empty;
        public string SourceCode { get; set; } = string.Empty;

        public int ProblemId { get; set; } = 1;
    }

}
