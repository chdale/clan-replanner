using System;
using System.Collections.Generic;
using System.Text;

namespace ClanRePlanner.Core.Areas.Character.Dtos
{
    public class UserCharactersDto
    {
        public int UserId { get; set; }
        public SelectedCharacterDto[] SelectedCharacters { get; set; }

    }
    public class SelectedCharacterDto
    {
        public int CharacterId { get; set; }
        public int Stars { get; set; }
    }
}
