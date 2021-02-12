using ClanRePlanner.Core.Areas.Character.Dtos;
using ClanRePlanner.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace ClanRePlanner.Core.Areas.Character.Queries
{
    public static class GetAvailableSupportCharacters
    {
        public static IEnumerable<CharacterDto> Query(int userId)
        {
            using (var db = new ClanRePlannerContext())
            {
                var clanId = db.Users.Single(x => x.UserId == userId).ClanId;

                var availableSupportCharacters = db.Users.Where(x => x.ClanId == clanId && x.UserId != userId)
                    .SelectMany(x => x.UserCharacters)
                    .Select(x => new CharacterDto(x.CharacterId, x.Character.Name, x.Character.MinStars, x.Character.MaxStars)
                    {
                        UserCharacterId = x.UserCharacterId,
                        CurrentStars = x.Stars,
                        UserName = x.User.Username,
                    });

                return availableSupportCharacters.OrderByDescending(x => x.CurrentStars).ToList();
            }
        }
    }
}
