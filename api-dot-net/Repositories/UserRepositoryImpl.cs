
using CjsApi.Models;

namespace CjsApi.Repositories
{
    public class UserRepositoryImpl : IUserRepository
    {

        private List<User> _users = new List<User>();
        public UserRepositoryImpl()
        {

            _users.Add(new User()
            {
                Id = 1,
                Username = "testuser1",
                Email = "testuser1@test.com",
                PasswordHash = "testpass1"
            });
            _users.Add(new User()
            {
                Id = 2,
                Username = "testuser2",
                Email = "testuser2@test.com",
                PasswordHash = "testpass2"
            });

            _users.Add(new User()
            {
                Id = 3,
                Username = "testuser3",
                Email = "testuser3@test.com",
                PasswordHash = "testpass3"
            });



        }
        public User AddUser(User user)
        {

            user.Id = _users.Count + 1;
            this._users.Add(user);
            return user;
        }

        public User GetUserByEmail(string email)
        {
            var user = _users.SingleOrDefault(u => u.Email == email) ?? throw new Exception("Invalid email or password");

            return user;
        }

        public User GetUserById(int id)
        {
            var user = _users.SingleOrDefault(u => u.Id == id) ?? throw new Exception("Invalid email or password");
            return user;

        }
    }

}