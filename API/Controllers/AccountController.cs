using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Extenstions;
using AutoMapper;
using Core.Entities.Identity;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  public class AccountController : BaseApiController
  {
    /// <summary>
    /// UserManager<AppUser>: Manages user-related operations like creating, retrieving, updating, and deleting users, and managing their passwords, roles, and claims.
    /// SignInManager<AppUser>: Manages authentication operations like signing users in and out, checking sign-in status, handling two-factor authentication, and dealing with external login providers.
    /// </summary>
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, ITokenService tokenService, IMapper mapper)
    {
      _userManager = userManager;
      _signInManager = signInManager;
      _tokenService = tokenService;
      _mapper = mapper;
    }


    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
      var user = await _userManager.FindByEmailFromClaimsPrinciple(User);
      return new UserDto
      {
        Email = user.Email,
        Token = _tokenService.CreateToken(user),
        DisplayName = user.DisplayName
      };
    }


    [HttpGet("emailexists")]



    [Authorize]
    [HttpGet("address")]
    public async Task<ActionResult<AddressDto>> GetUserAddress()
    {

      var user = await _userManager.FindUserByClaimsPrincipleWithAddress(User);

      return _mapper.Map<Address, AddressDto>(user.Address);

    }

    [Authorize]
    [HttpPut("address")]
    public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto address)
    {
      var user = await _userManager.FindUserByClaimsPrincipleWithAddress(HttpContext.User);
      user.Address = _mapper.Map<AddressDto, Address>(address);
      var result = await _userManager.UpdateAsync(user);
      if (result.Succeeded) return Ok(_mapper.Map<Address, AddressDto>(user.Address));

      return BadRequest("Problem updating the user");
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
      var user = await _userManager.FindByEmailAsync(loginDto.Email);
      if (user == null) return Unauthorized(new ApiResponse(401));
      var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.password, false);
      if (!result.Succeeded) return Unauthorized(new ApiResponse(401));
      return new UserDto
      {
        Email = user.Email,
        Token = _tokenService.CreateToken(user),
        DisplayName = user.DisplayName
      };
    }

    public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
    {
      return await _userManager.FindByEmailAsync(email) != null;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
      if (CheckEmailExistsAsync(registerDto.Email).Result.Value)
      {

        return new BadRequestObjectResult(new ApiValidationErrorResponse
        { 
          Errors = new[] { "Email address is in use" } 
          
        });
      }
      var user = new AppUser
      {
        DisplayName = registerDto.DisplayName,
        Email = registerDto.Email,
        UserName = registerDto.Email
      };
      // var user2 = new AppUser();
      // var displayName =  user2.DisplayName = registerDto.DisplayName;
      // var email =user2.Email = registerDto.Email;
      // var userEmail =   user2.UserName = registerDto.Email;
  


      var result = await _userManager.CreateAsync(user, registerDto.Password);
      if (!result.Succeeded) return BadRequest(new ApiResponse(400));

      return new UserDto
      {
        DisplayName = user.DisplayName,
        Token = _tokenService.CreateToken(user),
        Email = user.Email
      };
    }

  }
}