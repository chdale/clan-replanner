using ClanRePlanner.Core.Areas.Character.Dtos;
using ClanRePlanner.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace ClanRePlanner.Core.Areas.Character.Queries
{
    public static class GetCharacters
    {
        public static IEnumerable<CharacterDto> Query(int userId)
        {
            using (var db = new ClanRePlannerContext())
            {
                var characters = db.Characters.Select(x =>
                    new CharacterDto(x.CharacterId, x.Name, x.MinStars, x.MaxStars)
                ).ToList();

                var userCharacters = db.UserCharacters.Where(x => x.UserId == userId)
                    .Include(x => x.Character)
                    .Include(x => x.User).ToList();
                if (userCharacters.Any())
                {
                    var userCharacterDto = userCharacters.Select(x =>
                        new CharacterDto(x.CharacterId, x.Character.Name, x.Character.MinStars, x.Character.MaxStars)
                        {
                            UserCharacterId = x.UserCharacterId,
                            CurrentStars = x.Stars,
                            Selected = true,
                            UserName = x.User.Username,
                        }
                    );

                    var tempCharacters = userCharacterDto.Intersect(characters, new CharacterDtoIdComparer()).
                        Concat(characters.Except(userCharacterDto, new CharacterDtoIdComparer()));

                    characters = tempCharacters.ToList();
                }

                return characters.OrderBy(x => x.Name).ToList();
            }
        }
    }
}
