using Andon.Core.Data;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Andon.Core.Entities {
    [Table("UserAndon")]
    public class UserAndon {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        [Column("account")]
        public string Account { get; set; }

        [Column("password")]
        public string Password { get; set; }

        public static UserAndon GetById(int id) {
            using (AndonContext db = new AndonContext()) {
                return db.Users.FirstOrDefault(u => u.Id == id);
            }
        }

        public static UserAndon GetByLogin(string account, string password) {
            using (AndonContext db = new AndonContext()) {
                return db.Users.FirstOrDefault(u => u.Account == account && u.Password == password);
            }
        }

        public override string ToString() {
            return Name;
        }
    }
}
