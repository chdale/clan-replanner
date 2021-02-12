using System;
using System.Collections.Generic;

#nullable disable

namespace ClanRePlanner.Data.Models
{
    public partial class UserCharacter
    {
        public UserCharacter()
        {
            UserTeamCharacters = new HashSet<UserTeamCharacter>();
        }

        public int UserCharacterId { get; set; }
        public int UserId { get; set; }
        public int CharacterId { get; set; }
        public int Stars { get; set; }

        public virtual Character Character { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<UserTeamCharacter> UserTeamCharacters { get; set; }
    }
}
