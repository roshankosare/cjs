using Microsoft.EntityFrameworkCore;
using CjsApi.Models;

namespace CjsApi.Data
{

    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Problem> Problems => Set<Problem>();
        public DbSet<TestCase> TestCases => Set<TestCase>();
        public DbSet<Submission> Submissions => Set<Submission>();

        // public DbSet<ProblemTag> ProblemTags => Set<ProblemTag>();

        public DbSet<Tag> Tag => Set<Tag>();
    }

}

