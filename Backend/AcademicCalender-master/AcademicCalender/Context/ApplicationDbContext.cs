using Microsoft.EntityFrameworkCore;
using AcademicCalender.Entity;

namespace AcademicCalender.Repository
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Tabloların DbSet tanımları
        public DbSet<User> Users { get; set; }
        public DbSet<Calendar> Calendars { get; set; }
        public DbSet<Event> Events { get; set; }

        // Model yapılandırma (Fluent API)
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User tablo yapılandırması
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserID); // Primary key
                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100); // E-posta zorunlu ve max uzunluk 100
                entity.Property(u => u.Password)
                    .IsRequired()
                    .HasMaxLength(255); // Şifre zorunlu ve max uzunluk
                entity.Property(u => u.Role)
                    .IsRequired()
                    .HasMaxLength(50); // Kullanıcı rolü zorunlu ve max uzunluk
            });

            // Calendar tablo yapılandırması
            modelBuilder.Entity<Calendar>(entity =>
            {
                entity.HasKey(c => c.CalendarID); // Primary key
                entity.Property(c => c.Name)
                    .IsRequired()
                    .HasMaxLength(150); // Takvim ismi zorunlu ve max uzunluk
                entity.Property(c => c.CreatedDate)
                    .IsRequired(); // Takvim oluşturulma tarihi zorunlu

                // Events ile ilişki
                entity.HasMany(c => c.Events)
                    .WithOne(e => e.Calendar)
                    .HasForeignKey(e => e.CalendarID)
                    .OnDelete(DeleteBehavior.Cascade); // Calendar silinirse Events de silinir
            });

            // Event tablo yapılandırması
            modelBuilder.Entity<Event>(entity =>
            {
                entity.HasKey(e => e.EventID); // Primary key
                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(200); // Başlık zorunlu ve max uzunluk
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(500); // Açıklama zorunlu ve max uzunluk
                entity.Property(e => e.StartDate)
                    .IsRequired(); // Başlangıç tarihi zorunlu
                entity.Property(e => e.EndDate)
                    .IsRequired(); // Bitiş tarihi zorunlu

                // Calendar ile ilişki
                entity.HasOne(e => e.Calendar)
                    .WithMany(c => c.Events)
                    .HasForeignKey(e => e.CalendarID)
                    .OnDelete(DeleteBehavior.Cascade); // Calendar silinirse, Event'ler de silinir
            });
        }
    }
}
