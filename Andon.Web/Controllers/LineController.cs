using Andon.Core.Entities;
using Andon.Core.Transport;
using Andon.Web.Attribute;
using Andon.Web.Helpers;
using System;
using System.Web.Mvc;

namespace Andon.Web.Controllers {
    public class LineController : Controller {

        [ValidateSession()]
        public ActionResult Index() {
            return View();
        }

        [ValidateSession()]
        public ActionResult Modal(int id) {
            Line l = Line.GetById(id);
            return PartialView("_LineModal", l);
        }

        [ValidateSession()]
        public JsonResult GetList(int page, int itemsPerPage, string name) {
            int totalItems;
            var lines = Line.GetList(out totalItems, page, itemsPerPage, name);
            int totalPages = (int)Math.Ceiling((double)totalItems / itemsPerPage);
            return Json(new {
                html = ViewRenderer.RenderPartialViewToString(this, "_LineRow", lines),
                totalPages,
                totalItems,
                page
            }, JsonRequestBehavior.AllowGet);
        }

        [ValidateSession()]
        [HttpPost]
        public ActionResult Save(int id, string name) {
            ResultDTO dto = new ResultDTO();
            try {
                dto = Line.Save(id, name);
            } catch (Exception) {
                dto.Message = "No fue posible guardar la línea.";
            }
            return Json(dto, JsonRequestBehavior.AllowGet);
        }
    }
}
