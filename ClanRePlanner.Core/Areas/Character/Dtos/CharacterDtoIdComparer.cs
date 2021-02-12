using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace ClanRePlanner.Core.Areas.Character.Dtos
{
    internal class CharacterDtoIdComparer : IEqualityComparer<CharacterDto>
    {
        public bool Equals([AllowNull] CharacterDto x, [AllowNull] CharacterDto y)
        {
            return x.CharacterId == y.CharacterId;
        }

        public int GetHashCode([DisallowNull] CharacterDto obj)
        {
            return (obj.CharacterId).GetHashCode();
        }
    }
}
