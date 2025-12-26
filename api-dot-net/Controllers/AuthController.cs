

using System.Security.Claims;
using CjsApi.Dto.RequestDto;
using CjsApi.Dto.ResponseDto;
using CjsApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CjsApi.Controllers
{


  
    [ApiController]
    [Route("api/auth")]
    public class AuthController(AuthService authService, JwtTokenService jwtTokenService) : ControllerBase
    {
        readonly AuthService _authService = authService;
        readonly JwtTokenService _jwtTokenService = jwtTokenService;

  [AllowAnonymous]
        [HttpPost("signin")]
        public ActionResult<ApiResponseDto<string>> SignIn([FromBody] SignInRequestDto signInRequestDto)
        {

            try
            {
                AuthUserDto user = _authService.SignIn(signInRequestDto);

                var token = _jwtTokenService.GenerateToken(user.UserId, user.Email);

                Response.Cookies.Append(
                    "access_token",
                    token,
                   new CookieOptions
                   {
                       HttpOnly = true,          // JS cannot read token (XSS safe)
                       Secure = true,            // REQUIRED when SameSite=None
                       SameSite = SameSiteMode.None, // ✅ allow cross-site
                       Expires = DateTime.UtcNow.AddMinutes(60),
                       Path = "/"
                   }
                );


                return Ok(new ApiResponseDto<string>(
                    true,
                    "Sign-in successful",
                    null
                ));
            }
            catch (Exception e)
            {

                return BadRequest(new ApiResponseDto<string>(
                    false,
                    e.Message,
                    null
                ));
            }
        }



        [AllowAnonymous]
        [HttpPost("signup")]
        public ActionResult<ApiResponseDto<string>> SignUp([FromBody] SignUpRequestDto signUpRequestDto)
        {
            try
            {
                AuthUserDto user = _authService.SignUp(signUpRequestDto);


                var token = _jwtTokenService.GenerateToken(user.UserId, user.Email);

                Response.Cookies.Append(
                    "access_token",
                    token,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,          // HTTPS only
                        SameSite = SameSiteMode.Strict,
                        Expires = DateTime.UtcNow.AddMinutes(60)
                    }
                );

                return Ok(new ApiResponseDto<string>(
                    true,
                    "Sign-up successful",
                    null
                ));

            }
            catch (Exception e)
            {

                return BadRequest(new ApiResponseDto<string>(
                    false,
                    e.Message,
                    null
                ));
            }


        }

        [Authorize]
        [HttpPost("signout")]
        public ActionResult<ApiResponseDto<string>> LogOut()
        {
            Response.Cookies.Delete("access_token", new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Path = "/"
            });
            return Ok(new ApiResponseDto<string>(
                true,
                "Sign-out successful",
                null
            ));
        }

        [Authorize]
        [HttpPost("me")]
        public ActionResult<ApiResponseDto<AuthUserDto>> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
                return Unauthorized();

            var user = _authService.GetUserInfo(int.Parse(userId));

            return Ok(new ApiResponseDto<AuthUserDto>(
                true,
                "User information retrieved successfully",
                user
            ));

        }
    }
}