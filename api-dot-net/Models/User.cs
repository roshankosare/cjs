
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CjsApi.Models
{
    public enum Role
    {
        ADMIN,
        USER
    }
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Username { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        [Required]
        public string PasswordHash { get; set; } = null!;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Role Role { get; set; } = Role.USER;

        public string? About { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<Submission> Submissions { get; set; } = new List<Submission>();
    }
}