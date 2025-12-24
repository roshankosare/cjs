
using System.ComponentModel.DataAnnotations;

namespace CjsApi.Dto.RequestDto
{
    
    public class SignUpRequestDto
    {
        [Required(ErrorMessage = "Username is required.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is required.")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long.")]
        public string Password { get; set; }

        public SignUpRequestDto()
        {
            this.Username = "";
            this.Email = "";
            this.Password = "";
        }
    }
}