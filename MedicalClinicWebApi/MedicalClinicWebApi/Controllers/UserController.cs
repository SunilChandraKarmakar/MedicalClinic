using AutoMapper;
using MedicalClinicWebApi.DatabaseSetting;
using MedicalClinicWebApi.Model.Models;
using MedicalClinicWebApi.Model.ResponseModel;
using MedicalClinicWebApi.Model.ViewModels.Login;
using MedicalClinicWebApi.Model.ViewModels.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;

namespace MedicalClinicWebApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IMapper _mapper;
        private readonly JwtConfig _jwtConfig;
        private readonly MedicalClinicWebApiDbContext _context;

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper,
                            IOptions<JwtConfig> jwtConfig, MedicalClinicWebApiDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _jwtConfig = jwtConfig.Value;
            _context = context;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<UserViewModel>>> GetUsers()
        {
            var users = await _userManager.Users
                        .Include(u => u.UserType)
                        .ToListAsync();

            var mapUsers = _mapper.Map<IEnumerable<UserViewModel>>(users);
            return Ok(mapUsers);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(UserUpdateViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserUpdateViewModel>> Get(string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User id can not found! Try again.", null));

            var existUser = await _userManager.FindByIdAsync(id);
            var mapExistUser = _mapper.Map<UserUpdateViewModel>(existUser);

            if (mapExistUser != null)
                return Ok(mapExistUser);

            return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User can not found! Try again.", id));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPost]
        [ProducesResponseType(typeof(UserCreateViewModel), (int)HttpStatusCode.Created)]
        public ActionResult<UserCreateViewModel> Create([FromBody] UserCreateViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _mapper.Map<User>(model);
                user.UserName = model.Email;

                var result = _userManager.CreateAsync(user, model.Password);
                model = _mapper.Map<UserCreateViewModel>(user);

                if (result.Result.Succeeded)
                    return Ok(new ResponseStatusModel(ResponseCode.Ok, "User has been registered successfull.", model));
                else
                    return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User registration failed.", result.Result.Errors.Select(s => s.Description).ToArray()));
            }

            return BadRequest(new ResponseStatusModel(ResponseCode.FormValidateError, "Regsitration form validate error.", ModelState));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(UserUpdateViewModel), (int) HttpStatusCode.OK)]
        public async Task<ActionResult<UserUpdateViewModel>> Update(string id, [FromBody] UserUpdateViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                    return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User id can not found! Try again.", null));

                var existUser = await _userManager.Users
                                .AsNoTracking()
                                .Include(u => u.UserType)
                                .Where(x => x.Id == id)
                                .FirstOrDefaultAsync();

                if (existUser == null)
                    return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User can not found! Try again.", id));

                var updateUser = new User
                {
                    Id = existUser.Id,
                    AccessFailedCount = existUser.AccessFailedCount,
                    ConcurrencyStamp = existUser.ConcurrencyStamp,
                    Email = model.Email,
                    EmailConfirmed = existUser.EmailConfirmed,
                    FirstName = model.FirstName,
                    LastName = model.LastName,
                    LockoutEnabled = existUser.LockoutEnabled,
                    LockoutEnd = existUser.LockoutEnd ?? null,
                    NormalizedEmail = model.Email.ToUpper(),
                    NormalizedUserName = model.Email.ToUpper(),
                    PasswordHash = existUser.PasswordHash,
                    PhoneNumber = model.PhoneNumber,
                    PhoneNumberConfirmed = existUser.PhoneNumberConfirmed,
                    SecurityStamp = existUser.SecurityStamp,
                    TwoFactorEnabled = existUser.TwoFactorEnabled,
                    UserName = existUser.UserName,
                    UserTypeId = model.UserTypeId
                };

                //var result = await _userManager.UpdateAsync(updateUser);
                _context.Users.Update(updateUser);
                var result = await _context.SaveChangesAsync();
                model = _mapper.Map<UserUpdateViewModel>(existUser);

                if (result > 0)
                    return Ok(new ResponseStatusModel(ResponseCode.Ok, "User has been updated successfull.", model));

                return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User can not updated! Try again.", null));
            }

            return BadRequest(new ResponseStatusModel(ResponseCode.FormValidateError, "User edit form validate error.", ModelState));
        }

        [HttpPost]
        [ProducesResponseType(typeof(UserViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserViewModel>> Login([FromBody] LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);

                if (result.Succeeded)
                {
                    var getExistUser = await _userManager.Users
                                       .Include(u => u.UserType)
                                       .Where(u => u.Email.ToLower() == model.Email.ToLower())
                                       .FirstOrDefaultAsync();

                    var mapExistUser = _mapper.Map<UserViewModel>(getExistUser);
                    mapExistUser.Token = GenerateToken(mapExistUser);
                    return Ok(mapExistUser);
                }

                return BadRequest(new ResponseStatusModel(ResponseCode.FormValidateError, "Email and Password can not match, try again.", null));
            }

            return BadRequest(new ResponseStatusModel(ResponseCode.FormValidateError, "Regsitration form validate error.", ModelState));
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(string), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<string>> Delete(string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User id can not found! Try again.", null));

            var existUser = await _userManager.FindByIdAsync(id);

            if (existUser == null)
                return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User can not found! Try again.", null));

            var result = await _userManager.DeleteAsync(existUser);

            if (result.Succeeded)
                return Ok(new ResponseStatusModel(ResponseCode.Ok, "User has been deleted successfull", id));

            return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User can not deleted! Try again.", id));
        }

        private string GenerateToken(UserViewModel user)
        {
            JwtSecurityTokenHandler jwtTokenHendler = new JwtSecurityTokenHandler();
            byte[] key = System.Text.Encoding.ASCII.GetBytes(_jwtConfig.Key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new System.Security.Claims.ClaimsIdentity(new[]
                {
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.NameId, user.Id),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new System.Security.Claims.Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),

                Expires = DateTime.UtcNow.AddHours(12),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _jwtConfig.Issuer,
                Audience = _jwtConfig.Audience
            };

            var token = jwtTokenHendler.CreateToken(tokenDescriptor);
            return jwtTokenHendler.WriteToken(token);
        }
    }
}