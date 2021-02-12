namespace ClanRePlanner.Core.Areas.Character.Dtos
{
    public class CharacterDto
    {
        public CharacterDto(int characterId, string name, int minStars, int maxStars)
        {
            CharacterId = characterId;
            Name = name;
            MinStars = minStars;
            MaxStars = maxStars;
            CurrentStars = minStars;
            Selected = false;
        }

        public int CharacterId { get; private set; }
        public int UserCharacterId { get; set; }
        public string Name { get; private set; }
        public int MinStars { get; private set; }
        public int MaxStars { get; private set; }
        public int CurrentStars { get; set; }
        public bool Selected { get; set; }
        public string UserName { get; set; }
    }
}
