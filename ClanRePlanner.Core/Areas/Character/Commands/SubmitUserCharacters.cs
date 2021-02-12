using ClanRePlanner.Core.Areas.Character.Dtos;
using ClanRePlanner.Data.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace ClanRePlanner.Core.Areas.Character.Commands
{
    public static class SubmitUserCharacters
    {
        public static HttpStatusCode Command(int userId, SelectedCharacterDto[] selectedCharacters)
        {
            using (var db = new ClanRePlannerContext())
            {
                var userCharactersToUpdate = new List<UserCharacter>();
                var userCharactersToAdd = new List<UserCharacter>();
                var userCharactersToDelete = new List<UserCharacter>();

                var oldUserCharacters = db.UserCharacters.Where(x => x.UserId == userId).ToList();

                var selectedUserCharacters = selectedCharacters.Select(x => new UserCharacter
                {
                    UserId = userId,
                    CharacterId = x.CharacterId,
                    Stars = x.Stars,
                });

                if (oldUserCharacters.Any())
                {
                    var matchedUserCharacters = oldUserCharacters
                        .Intersect(selectedUserCharacters, new UserCharacterComparer()).ToList();

                    foreach (var matchedDbUserCharacter in matchedUserCharacters)
                    {
                        var newStarValue = selectedUserCharacters.Single(x => x.UserId == matchedDbUserCharacter.UserId &&
                                x.CharacterId == matchedDbUserCharacter.CharacterId).Stars;
                        matchedDbUserCharacter.Stars = newStarValue;
                    }

                    userCharactersToUpdate = matchedUserCharacters;

                    userCharactersToAdd = selectedUserCharacters
                        .Except(oldUserCharacters, new UserCharacterComparer()).ToList();

                    userCharactersToDelete = oldUserCharacters
                        .Except(selectedUserCharacters, new UserCharacterComparer()).ToList();
                }
                else
                {
                    userCharactersToAdd = selectedUserCharacters.ToList();
                }

                if (userCharactersToUpdate.Any())
                {
                    db.UserCharacters.UpdateRange(userCharactersToUpdate);
                }

                if (userCharactersToAdd.Any())
                {
                    db.UserCharacters.AddRange(userCharactersToAdd);
                }

                if (userCharactersToDelete.Any())
                {
                    db.UserCharacters.RemoveRange(userCharactersToDelete);
                }

                try
                {
                    db.SaveChanges();
                }
                catch(Exception e)
                {
                    return HttpStatusCode.ServiceUnavailable;
                }

                return HttpStatusCode.OK;
            }
        }
    }
}
