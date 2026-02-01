using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CjsApi.Repositories.ProblemRepository;
using CjsApi.Repositories.SubmissionRepository;
using CjsApi.Repositories.UserRepository;
using CjsApi.Models;

namespace CjsApi.Controllers
{
    [Route("api/admin/stats")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IProblemRepository _problemRepository;
        private readonly ISubmissionRepository _submissionRepository;
        private readonly IUserRepository _userRepository;

        public AdminController(
            IProblemRepository problemRepository, 
            ISubmissionRepository submissionRepository,
            IUserRepository userRepository)
        {
            _problemRepository = problemRepository;
            _submissionRepository = submissionRepository;
            _userRepository = userRepository;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetStatsOverview()
        {
            var problemCount = await _problemRepository.CountAsync();
            var submissionCount = await _submissionRepository.CountAsync();
            var userCount = await _userRepository.CountAsync();

            return Ok(new
            {
                success = true,
                message = "Stats retrieved",
                data = new
                {
                    totalProblems = problemCount,
                    totalSubmissions = submissionCount,
                    totalUsers = userCount
                }
            });
        }
    }
}
