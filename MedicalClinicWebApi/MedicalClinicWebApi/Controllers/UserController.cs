using AutoMapper;
using MedicalClinicWebApi.Model.Models;
using MedicalClinicWebApi.Model.ResponseModel;
using MedicalClinicWebApi.Model.ViewModels.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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

        public UserController(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper,
                            IOptions<JwtConfig> jwtConfig)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _jwtConfig = jwtConfig.Value;
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<UserViewModel>), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<IEnumerable<UserViewModel>>> GetUsers()
        {
            var users = _mapper.Map<IEnumerable<UserViewModel>>(await _userManager.Users.Include(u => u.UserType)
                .Where(u => u.Email.ToLower() != "admin@gmail.com").ToListAsync());

            return Ok(users);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet]
        [ProducesResponseType(typeof(UserUpsertViewModel), (int)HttpStatusCode.OK)]
        public async Task<ActionResult<UserUpsertViewModel>> Get(string id)
        {
            if (string.IsNullOrEmpty(id) || string.IsNullOrWhiteSpace(id))
                return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User id can not found! Try again.", null));

            var existUser = _mapper.Map<UserUpsertViewModel>(await _userManager.FindByIdAsync(id));

            if (existUser != null)
                return Ok(existUser);

            return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User can not found! Try again.", id));
        }

        [HttpPost]
        public ActionResult<UserEditViewModel> Create([FromBody] RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                var user = _mapper.Map<User>(model);
                user.UserName = model.Email;
                user.CreatedTime = DateTime.UtcNow;
                user.LastModifiedTime = DateTime.UtcNow;

                var result = _userManager.CreateAsync(user, model.Password);
                model = _mapper.Map<RegisterViewModel>(user);

                if (result.Result.Succeeded)
                    return Ok(new ResponseStatusModel(ResponseCode.Ok, "User has been registered successfull.", model));
                else
                    return BadRequest(new ResponseStatusModel(ResponseCode.Error, "User registration failed.", result.Result.Errors.Select(s => s.Description).ToArray()));
            }

            return BadRequest(new ResponseStatusModel(ResponseCode.FormValidateError, "Regsitration form validate error.", ModelState));
        }
    }
}