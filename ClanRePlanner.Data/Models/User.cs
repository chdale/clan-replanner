using System;
using System.Collections.Generic;

#nullable disable

namespace ClanRePlanner.Data.Models
{
    public partial class User
    {
        public User()
        {
            UserCharacters = new HashSet<UserCharacter>();
            UserTeamCharacters = new HashSet<UserTeamCharacter>();
        }

        public int UserId { get; set; }
        public string Username { get; set; }
        public int? ClanId { get; set; }

        public virtual Clan UserNavigation { get; set; }
        public virtual ICollection<UserCharacter> UserCharacters { get; set; }
        public virtual ICollection<UserTeamCharacter> UserTeamCharacters { get; set; }
    }
}
