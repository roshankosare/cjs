
using CjsApi.Dto.RequestDto;
using CjsApi.Dto.ResponseDto;

namespace CjsApi.Services
{
    public class AuthService
    {

        UserService _userService;


        public AuthService(UserService userService)
        {
            _userService = userService;

        }
        public AuthUserDto SignIn(SignInRequestDto signInRequestDto)
        {

            var user = _userService.FindUserByEmail(signInRequestDto.Email) ?? throw new Exception("Invalid email or password.");



            if (user.PasswordHash.Equals(signInRequestDto.Password) == false)
            {

                throw new Exception("Invalid email or password.");
            }

            return new AuthUserDto(user.Id.ToString(), user.Email, user.Username, user.Role);
        }

        public AuthUserDto SignUp(SignUpRequestDto signUpRequestDto)
        {
            var existingUser = _userService.FindUserByEmail(signUpRequestDto.Email);
            if (existingUser != null)
            {
                throw new Exception("Email already in use.");
            }

            var newUser = _userService.CreateUser(signUpRequestDto);


            return new AuthUserDto(newUser.Id.ToString(), newUser.Email, newUser.Username, newUser.Role);
        }



        public AuthUserDto GetUserInfo(int id)
        {

            var user = _userService.FindUserById(id) ?? throw new Exception("Invalid userid.");
            
            return new AuthUserDto(user.Id.ToString(), user.Email, user.Username, user.Role);

        }
    }
}