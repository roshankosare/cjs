namespace CjsApi.Models
{


    public class UserProblem
    {
        public int UserId { get; set; }
        public int ProblemId { get; set; }

        public bool IsSolved { get; set; }
        public DateTime? SolvedAt { get; set; }
    }

}