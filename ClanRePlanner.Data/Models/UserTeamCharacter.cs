using System;
using System.Collections.Generic;
using System.Text;

namespace ClanRePlanner.Data.Models
{
    public partial class UserTeamCharacter
    {
        public int UserTeamCharacterId { get; set; }
        public int UserCharacterId { get; set; }
        public int UserId { get; set; }
        public int TeamTypeId { get; set; }

        public virtual UserCharacter UserCharacter { get; set; }
        public virtual User User { get; set; }
        public virtual TeamType TeamType { get; set; }
    }
}
