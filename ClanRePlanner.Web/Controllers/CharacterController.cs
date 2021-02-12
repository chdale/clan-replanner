using System.Collections.Generic;
using System.Net;
using ClanRePlanner.Core.Areas.Character.Commands;
using ClanRePlanner.Core.Areas.Character.Dtos;
using ClanRePlanner.Core.Areas.Character.Queries;
using ClanRePlanner.Core.Models.Enums;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ClanRePlanner.Web.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CharacterController : ControllerBase
    {
        private readonly ILogger<CharacterController> _logger;

        public CharacterController(ILogger<CharacterController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        [Route("{userId}")]
        public IEnumerable<CharacterDto> Get(int userId)
        {
            return GetCharacters.Query(userId);
        }

        [HttpGet]
        [Route("fetchAvailableSupportCharacters/{userId}")]
        public IEnumerable<CharacterDto> FetchAvailableSupport(int userId)
        {
            return GetAvailableSupportCharacters.Query(userId);
        }

        [HttpPost]
        [Route("user/{userId}")]
        public HttpStatusCode PostUserCharacters(int userId, [FromBody] SelectedCharacterDto[] selectedCharacters)
        {
            return SubmitUserCharacters.Command(userId, selectedCharacters);
        }

        [HttpPost]
        [Route("addTeam/{userId}/team/{teamType}/{userCharacterId}")]
        public HttpStatusCode AddTeamMember(int userId, TeamType teamType, int userCharacterId)
        {
            return AddUpdateTeamMember.Command(userId, teamType, userCharacterId, null);
        }

        [HttpPut]
        [Route("updateTeam/{userId}/team/{teamType}/{newUserCharacterId}/{oldUserCharacterId}")]
        public HttpStatusCode UpdateTeamMember(int userId, TeamType teamType, int newUserCharacterId, int oldUserCharacterId)
        {
            return AddUpdateTeamMember.Command(userId, teamType, newUserCharacterId, oldUserCharacterId);
        }
    }
}
