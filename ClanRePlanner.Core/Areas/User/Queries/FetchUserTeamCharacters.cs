using ClanRePlanner.Core.Areas.User.Dtos;
using ClanRePlanner.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace ClanRePlanner.Core.Areas.User.Queries
{
    public static class FetchUserTeamCharacters
    {
        public static UserTeamCharactersDto Query(int userId)
        {
            using (var db = new ClanRePlannerContext())
            {
                var user = db.Users.SingleOrDefault(x => x.UserId == userId);
                if (user == null)
                {
                    throw new InvalidOperationException($"User with the ID: {userId} was not found.");
                }

                var userTeamCharacters = db.UserTeamCharacter
                    .Where(x => x.UserId == userId)
                    .Include(x => x.User)
                    .Include(x => x.UserCharacter.Character)
                    .Include(x => x.UserCharacter.User)
                    .ToList();

                if (!userTeamCharacters.Any())
                {
                    return new UserTeamCharactersDto()
                    {
                        UserName = user.Username,
                    };
                }

                var userTeamCharactersDto = new UserTeamCharactersDto
                {
                    UserName = user.Username,
                };

                foreach (var team in userTeamCharactersDto.Teams)
                {
                    team.Team.AddRange(userTeamCharacters
                        .Where(x => x.TeamTypeId == (int)team.TeamType)
                        .OrderBy(x => x.UserCharacter.Character.SortOrder)
                        .Select(x => new TeamCharacterDto
                        {
                            UserCharacterId = x.UserCharacterId,
                            CharacterName = x.UserCharacter.Character.Name,
                            UserName = x.UserCharacter.User.Username,
                            IsSupportUnit = x.UserCharacter.UserId != x.UserId,
                            Stars = x.UserCharacter.Stars,
                        }).ToList());
                }

                return userTeamCharactersDto;
            }
        }
    }
}
