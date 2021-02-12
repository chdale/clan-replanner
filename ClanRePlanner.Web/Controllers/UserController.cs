using ClanRePlanner.Core.Areas.User.Dtos;
using ClanRePlanner.Core.Areas.User.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClanRePlanner.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("getUserTeamCharacters/{userId}")]
        public UserTeamCharactersDto GetUserTeamCharacters(int userId)
        {
            return FetchUserTeamCharacters.Query(userId);
        }
    }
}
