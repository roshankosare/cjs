using System.Text.Json.Serialization;
using CjsApi.Models;

namespace CjsApi.Dto.ResponseDto
{
    public class AuthUserDto(string userId, string email, string username, Role role)
    {
        public string UserId { get; set; } = userId;
        public string Email { get; set; } = email;

        public string Username { get; set; } = username;

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public Role Role { get; set; } = role;
    }
}