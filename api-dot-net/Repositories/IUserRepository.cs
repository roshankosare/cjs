using CjsApi.Models;

namespace CjsApi.Repositories
{
    

    public interface IUserRepository
    {
        User AddUser(User user);
        User GetUserByEmail(string email);

        User GetUserById(int id);

    }
}