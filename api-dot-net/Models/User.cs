
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
    }
}