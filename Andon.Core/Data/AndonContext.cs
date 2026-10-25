using Andon.Core.Entities;
using MySql.Data.EntityFramework;
using System.Data.Entity;

namespace Andon.Core.Data {
    [DbConfigurationType(typeof(MySqlEFConfiguration))]
    public class AndonContext : DbContext {

        static AndonContext() {
            Database.SetInitializer<AndonContext>(null);
        }

        public AndonContext() : base("name=connection") {
        }

        public DbSet<Line> Lines { get; set; }
        public DbSet<UserAndon> Users { get; set; }
    }
}
