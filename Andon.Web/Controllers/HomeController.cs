using Andon.Core.Entities;
using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace Andon.Web.Controllers {
    public class HomeController : Controller {
        public ActionResult Index() {
            FormsAuthentication.SignOut();
            Response.Cookies[FormsAuthentication.FormsCookieName].Expires = DateTime.Now.AddYears(-1);
            if (Session != null) {
                Session.Clear();
                Session.Abandon();
            }
            return View();
        }

        public ActionResult Logout() {
            return RedirectToAction("Index", "Home");
        }

        [HttpPost]
        public ActionResult Index(FormCollection model) {
            try {
                string account = model["user"];
                string password = model["password"];

                if (String.IsNullOrWhiteSpace(account) || String.IsNullOrWhiteSpace(password)) {
                    ViewBag.Message = "Captura usuario y contraseña.";
                    return View("Index");
                }

                UserAndon user = UserAndon.GetByLogin(account, password);
                if (user == null) {
                    ViewBag.Message = "Usuario o contraseña incorrectos.";
                    return View("Index");
                }

                var ticket = new FormsAuthenticationTicket(1, user.Id.ToString(), DateTime.Now, DateTime.Now.AddHours(8), false, "");
                var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, FormsAuthentication.Encrypt(ticket));
                HttpContext.Response.Cookies.Add(cookie);

                return RedirectToAction("Index", "Line");
            } catch (Exception) {
                ViewBag.Message = "No fue posible iniciar sesión.";
                return View("Index");
            }
        }
    }
}
