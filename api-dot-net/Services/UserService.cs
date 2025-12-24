
using CjsApi.Dto.RequestDto;
using CjsApi.Models;
using CjsApi.Repositories;

namespace CjsApi.Services
{
    public class UserService(IUserRepository userRepository)
    {
        IUserRepository _userRepository = userRepository;


        public User CreateUser(SignUpRequestDto signUpRequest)
        {
            var user = new Models.User
            {
                Username = signUpRequest.Username,
                Email = signUpRequest.Email,
                PasswordHash = signUpRequest.Password,
                Role = Role.USER
            };

            return _userRepository.AddUser(user);

        }


        public User? FindUserByEmail(string email)
        {
            var user = _userRepository.GetUserByEmail(email);
            if (user == null)
            {
                return null;
            }

            return new Models.User
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Role = user.Role
            };
        }

        public User? FindUserById(int id)
        {
            
             var user = _userRepository.GetUserById(id);
            if (user == null)
            {
                return null;
            }

            return new Models.User
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                PasswordHash = user.PasswordHash,
                Role = user.Role
            };
        }

    }
}