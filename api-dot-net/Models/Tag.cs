namespace CjsApi.Models
{

    public class Tag
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; // Array, DP, Graph
    }

    public class ProblemTag
    {
        public int ProblemId { get; set; }
        public int TagId { get; set; }
    }


}