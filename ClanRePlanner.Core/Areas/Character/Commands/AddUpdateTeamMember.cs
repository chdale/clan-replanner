using ClanRePlanner.Data.Models;
using System;
using System.Linq;
using System.Net;

namespace ClanRePlanner.Core.Areas.Character.Commands
{
    public static class AddUpdateTeamMember
    {
        //TODO - Remove same character id from same team
        public static HttpStatusCode Command(int userId, Models.Enums.TeamType teamType, int newUserCharacterId, int? oldUserCharacterId)
        {
            using (var db = new ClanRePlannerContext())
            {
                var teams = db.UserTeamCharacter.Where(x => x.UserId == userId);
                
                //Remove old character from your team
                if (oldUserCharacterId.HasValue)
                {
                    var userTeamCharacterToRemove = teams.Single(x => x.TeamTypeId == (int)teamType && x.UserCharacterId == oldUserCharacterId);
                    db.UserTeamCharacter.Remove(userTeamCharacterToRemove);

                    //Remove borrowed character from other teams using it if support
                    if (teamType == Models.Enums.TeamType.Support)
                    {
                        var userTeamCharactersToRemove = db.UserTeamCharacter.Where(x => x.UserCharacterId == oldUserCharacterId.Value).ToList();
                        
                        if (userTeamCharactersToRemove.Any())
                        {
                            db.UserTeamCharacter.RemoveRange(userTeamCharactersToRemove);
                        }
                    }
                }

                //If you're adding a unit that exists in the same team, do nothing
                var existsInSameTeam = teams.Any(x => x.UserCharacterId == newUserCharacterId && x.TeamTypeId == (int)teamType);
                if (existsInSameTeam)
                {
                    return HttpStatusCode.OK;
                }

                //If you're adding a unit to a normal team, remove the unit from other teams
                if (teamType != Models.Enums.TeamType.Support)
                {
                    var unitToRemoveFromOtherTeam = teams
                        .SingleOrDefault(x => x.UserCharacterId == newUserCharacterId &&
                            x.TeamTypeId != (int)Models.Enums.TeamType.Support);

                    if (unitToRemoveFromOtherTeam != default(UserTeamCharacter))
                    {
                        db.UserTeamCharacter.Remove(unitToRemoveFromOtherTeam);
                    }
                }

                //If you're adding a unit to a team that contains the same character, remove the old unit
                var selectedCharacterId = db.UserCharacters.Single(x => x.UserCharacterId == newUserCharacterId).CharacterId;
                var matchingCharacter = teams
                    .SingleOrDefault(x => x.UserCharacter.CharacterId == selectedCharacterId && 
                        (int)teamType == x.TeamTypeId);
                if (matchingCharacter != default(UserTeamCharacter))
                {
                    db.UserTeamCharacter.Remove(matchingCharacter);
                }

                //Add unit to team
                var userTeamCharacterToAdd = new UserTeamCharacter()
                {
                    UserCharacterId = newUserCharacterId,
                    UserId = userId,
                    TeamTypeId = (int)teamType,
                };

                db.UserTeamCharacter.Add(userTeamCharacterToAdd);

                try
                {
                    db.SaveChanges();
                }
                catch (Exception e)
                {
                    return HttpStatusCode.ServiceUnavailable;
                }

                return HttpStatusCode.OK;
            }
        }
    }
}
