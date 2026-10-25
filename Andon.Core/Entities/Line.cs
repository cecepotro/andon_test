using Andon.Core.Data;
using Andon.Core.Transport;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace Andon.Core.Entities {
    [Table("Line")]
    public class Line {
        [Column("id")]
        public int Id { get; set; }

        [Column("name")]
        public string Name { get; set; }

        public static Line GetById(int id) {
            using (AndonContext db = new AndonContext()) {
                return db.Lines.FirstOrDefault(l => l.Id == id);
            }
        }

        public static IList<Line> GetList(out int totalItems, int page, int itemsPerPage, string name) {
            using (AndonContext db = new AndonContext()) {
                IQueryable<Line> query = db.Lines;
                if (!string.IsNullOrEmpty(name)) {
                    query = query.Where(l => l.Name.Contains(name));
                }
                totalItems = query.Count();
                return query.OrderByDescending(l => l.Id)
                    .Skip((page - 1) * itemsPerPage)
                    .Take(itemsPerPage)
                    .ToList();
            }
        }

        public static ResultDTO Save(int id, string name) {
            ResultDTO dto = new ResultDTO();
            using (AndonContext db = new AndonContext()) {
                Line l = id == 0 ? new Line() : db.Lines.FirstOrDefault(x => x.Id == id);
                if (l == null) {
                    dto.Message = "La línea no existe.";
                    return dto;
                }
                l.Name = name;
                if (id == 0) {
                    db.Lines.Add(l);
                }
                db.SaveChanges();
                dto.Success = true;
            }
            return dto;
        }

        public override string ToString() {
            return Name;
        }
    }
}
