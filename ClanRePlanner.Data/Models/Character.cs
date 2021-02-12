using System;
using System.Collections.Generic;

#nullable disable

namespace ClanRePlanner.Data.Models
{
    public partial class Character
    {
        public Character()
        {
            UserCharacters = new HashSet<UserCharacter>();
        }

        public int CharacterId { get; set; }
        public string Name { get; set; }
        public int MinStars { get; set; }
        public int MaxStars { get; set; }
        public int? SortOrder { get; set; }

        public virtual ICollection<UserCharacter> UserCharacters { get; set; }
    }
}
