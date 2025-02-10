namespace AcademicCalender.Entity
{
    public class User
    {
        public int UserID { get; set; } // Birincil anahtar
        public string Email { get; set; } // Kullanıcı e-postası
        public string Password { get; set; } // Kullanıcı şifresi
        public string Role { get; set; } = "Admin";
    }
}
