
using CjsApi.Dto;
using CjsApi.Dto.ResponseDto;
using CjsApi.Services.ProblemService;
using Docker.DotNet.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestCaseDto = CjsApi.Dto.TestCaseDto;

namespace CjsApi.Controllers
{

    [ApiController]
    [Route("api/problems")]
    public class ProblemsController : ControllerBase
    {

        private IProblemService _problemService;

        public ProblemsController(IProblemService problemService)
        {
            _problemService = problemService;

        }
        [HttpGet]
        public async Task<ActionResult<ApiResponseDto<GetAllProblemDto>>> GetAllProblems(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? search = null,
            [FromQuery] Difficulty? difficulty = null
            )
        {
            if (page <= 0) page = 1;
            if (pageSize <= 0 || pageSize > 50) pageSize = 10;

            // 1️⃣ Fetch all (or IQueryable ideally)
            var problemsQuery = _problemService.GetProblemsQueryable(
                difficulty: difficulty,
                tags: null,
                search: search
            );

            // 2️⃣ Total count (before pagination)
            var total = await problemsQuery.CountAsync();

            // 3️⃣ Apply pagination
            var problems = await problemsQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var responseDto = new GetAllProblemDto
            {
                Problems = problems.Select(p => new ProblemMetaDataDto
                {
                    Title = p.Title,
                    Difficulty = p.Difficulty,
                    Slug = p.Slug
                }).ToList(),

                Total = total,
                Page = page,
                PageSize = pageSize
            };

            return Ok(new ApiResponseDto<GetAllProblemDto>(
                true,
                "Problems fetched successfully",
                responseDto
            ));
        }


        [HttpGet("{slug}")]
        public async Task<ActionResult<ApiResponseDto<GetProblemDto>>> GetProblem(string slug)
        {
            var problem = await _problemService.GetProblemBySlugAsync(slug);

            if (problem == null)
            {
                return NotFound(new ApiResponseDto<GetProblemDto>(
                    false,
                    "Problem not found",
                    null
                ));
            }

            var dto = new GetProblemDto
            {
                Id = problem.Id,
                Title = problem.Title,
                Description = problem.Description,
                Difficulty = problem.Difficulty,

                Tags = problem.ProblemTags
                    .Select(pt => pt.Tag.Name)
                    .ToList(),

                SampleTestCases = problem.TestCases
                    .Where(tc => tc.IsSample)
                    .Select(tc => new SampleTestCaseDto
                    {
                        Input = tc.Input,
                        Output = tc.ExpectedOutput
                    })
                    .ToList()
            };

            return Ok(new ApiResponseDto<GetProblemDto>(
                true,
                "Problem fetched successfully",
                dto
            ));
        }



        [Authorize(Roles = "ADMIN")]
        [HttpGet("admin/{slug}")]
        public async Task<ActionResult<ApiResponseDto<AdminGetProblemDto>>> GetProblemAdmin(string slug)
        {
            var problem = await _problemService.GetProblemBySlugAsync(slug);

            Console.Write("Test cases Count" + problem.TestCases.Count());

            if (problem == null)
            {
                return NotFound(new ApiResponseDto<GetProblemDto>(
                    false,
                    "Problem not found",
                    null
                ));
            }

            var dto = new AdminGetProblemDto
            {
                Id = problem.Id,
                Title = problem.Title,
                Description = problem.Description,
                Difficulty = problem.Difficulty,

                Tags = problem.ProblemTags
                    .Select(pt => pt.Tag.Name)
                    .ToList(),

                TestCases = problem.TestCases
                    .Select(tc => new TestCaseDto
                    {
                        Input = tc.Input,
                        Output = tc.ExpectedOutput,
                        Sample = tc.IsSample
                    })
                    .ToList()
            };

            return Ok(new ApiResponseDto<AdminGetProblemDto>(
                true,
                "Problem fetched successfully",
                dto
            ));
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPost]
        public async Task<ActionResult<ApiResponseDto<int>>> CreateProblem(
        [FromBody] CreateProblemDto dto)
        {
            var problemId = await _problemService.CreateProblemAsync(dto);

            return Ok(new ApiResponseDto<int>(
                true,
                "Problem created successfully",
                problemId
            ));
        }

        [Authorize(Roles = "ADMIN")]
        [HttpPut("{id:int}")]
        public async Task<ActionResult<ApiResponseDto<bool>>> UpdateProblem(
        int id,
        [FromBody] UpdateProblemDto dto)
        {
            var updated = await _problemService.UpdateProblemAsync(id, dto);

            if (!updated)
            {
                return NotFound(new ApiResponseDto<bool>(
                    false,
                    "Problem not found",
                    false
                ));
            }

            return Ok(new ApiResponseDto<bool>(
                true,
                "Problem updated successfully",
                true
            ));
        }

    }


}