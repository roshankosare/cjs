
namespace CjsApi.Models
{
    public enum Role
    {
        ADMIN,
        USER
    }
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;

        public Role Role { get; set; } = Role.USER;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}