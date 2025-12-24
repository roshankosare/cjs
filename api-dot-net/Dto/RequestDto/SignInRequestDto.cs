using System.ComponentModel.DataAnnotations;

namespace CjsApi.Dto.RequestDto
{
    public class SignInRequestDto
    {
        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email address.")]
        public string Email { get; set; } = String.Empty;
        [Required(ErrorMessage = "Password is required.")]

        public string Password { get; set; } = String.Empty;


    }
}