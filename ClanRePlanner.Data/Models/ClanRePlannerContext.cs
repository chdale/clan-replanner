using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace ClanRePlanner.Data.Models
{
    public partial class ClanRePlannerContext : DbContext
    {
        public ClanRePlannerContext()
        {
        }

        public ClanRePlannerContext(DbContextOptions<ClanRePlannerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Character> Characters { get; set; }
        public virtual DbSet<Clan> Clans { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<UserCharacter> UserCharacters { get; set; }
        public virtual DbSet<TeamType> TeamType { get; set; }
        public virtual DbSet<UserTeamCharacter> UserTeamCharacter { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseSqlServer("Server=.\\SQLExpress;Database=ClanRePlanner;Trusted_Connection=True;");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "SQL_Latin1_General_CP1_CI_AS");

            modelBuilder.Entity<Character>(entity =>
            {
                entity.ToTable("Character");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Clan>(entity =>
            {
                entity.ToTable("Clan");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");

                entity.Property(e => e.UserId).ValueGeneratedOnAdd();

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.HasOne(d => d.UserNavigation)
                    .WithOne(p => p.User)
                    .HasForeignKey<User>(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_User_Clan");
            });

            modelBuilder.Entity<UserCharacter>(entity =>
            {
                entity.ToTable("UserCharacter");

                entity.HasOne(d => d.Character)
                    .WithMany(p => p.UserCharacters)
                    .HasForeignKey(d => d.CharacterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserCharacter_Character");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserCharacters)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserCharacter_User");
            });

            modelBuilder.Entity<TeamType>(entity =>
            {
                entity.ToTable("TeamType");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(10);
            });

            modelBuilder.Entity<UserTeamCharacter>(entity =>
            {
                entity.ToTable("UserTeamCharacter");

                entity.HasOne(d => d.UserCharacter)
                    .WithMany(p => p.UserTeamCharacters)
                    .HasForeignKey(d => d.UserCharacterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserTeamCharacter_UserCharacter");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.UserTeamCharacters)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserTeamCharacter_User");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
