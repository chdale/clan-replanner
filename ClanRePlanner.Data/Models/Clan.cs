using System;
using System.Collections.Generic;

#nullable disable

namespace ClanRePlanner.Data.Models
{
    public partial class Clan
    {
        public int ClanId { get; set; }
        public string Name { get; set; }

        public virtual User User { get; set; }
    }
}
