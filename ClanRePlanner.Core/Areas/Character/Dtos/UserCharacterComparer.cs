using ClanRePlanner.Data.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace ClanRePlanner.Core.Areas.Character.Dtos
{
    internal class UserCharacterComparer : IEqualityComparer<UserCharacter>
    {
        public bool Equals([AllowNull] UserCharacter x, [AllowNull] UserCharacter y)
        {
            return x.UserId == y.UserId && x.CharacterId == y.CharacterId;
        }

        public int GetHashCode([DisallowNull] UserCharacter obj)
        {
            return (obj.UserId, obj.CharacterId).GetHashCode();
        }
    }
}