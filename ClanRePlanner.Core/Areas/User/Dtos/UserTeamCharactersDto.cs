using ClanRePlanner.Core.Models.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace ClanRePlanner.Core.Areas.User.Dtos
{
    public class UserTeamCharactersDto
    {
        public UserTeamCharactersDto()
        {
            Teams = new List<TeamDto>()
            {
                new TeamDto(TeamType.Team1),
                new TeamDto(TeamType.Team2),
                new TeamDto(TeamType.Team3),
                new TeamDto(TeamType.Support),
            };
        }

        public string UserName { get; set; }
        public IEnumerable<TeamDto> Teams { get; set; }
    }

    public class TeamDto
    {
        public TeamDto() { }
        public TeamDto(TeamType teamType)
        {
            Team = new List<TeamCharacterDto>();
            TeamType = teamType;

            if (teamType == TeamType.Support)
            {
                MaxLength = 2;
            }
        }

        public List<TeamCharacterDto> Team { get; set; }
        public TeamType TeamType { get; set; }
        public int MaxLength { get; set; } = 5;
    }

    public class TeamCharacterDto
    {
        public int UserCharacterId { get; set; }
        public string CharacterName { get; set; }
        public string UserName { get; set; }
        public bool IsSupportUnit { get; set; }
        public int Stars { get; set; }
    }
}
