
namespace CjsApi.Models
{
    
    public class TestCase
{
    public int Id { get; set; }

    public int ProblemId { get; set; }
    public Problem Problem { get; set; } = null!;

    public string Input { get; set; } = null!;
    public string ExpectedOutput { get; set; } = null!;

    public bool IsSample { get; set; } // visible to user
}

}