using System;
using System.Collections.Generic;
using System.Text;

namespace ClanRePlanner.Data.Models
{
    public partial class TeamType
    {
        public TeamType()
        {
            UserTeamCharacters = new HashSet<UserTeamCharacter>();
        }

        public int TeamTypeId { get; set; }
        public string Name { get; set; }
        public virtual ICollection<UserTeamCharacter> UserTeamCharacters { get; set; }
    }
}
