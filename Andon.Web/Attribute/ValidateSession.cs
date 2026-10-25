using Andon.Core.Entities;
using System.Web;
using System.Web.Mvc;

namespace Andon.Web.Attribute {
    public class ValidateSession : AuthorizeAttribute {

        protected override bool AuthorizeCore(HttpContextBase httpContext) {
            UserAndon user = AuthUtil.GetCurrentUser();
            if (user == null) {
                return false;
            }
            httpContext.Items["CurrentUser"] = user;
            return true;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext context) {
            if (context.HttpContext.Request.IsAjaxRequest()) {
                context.HttpContext.Response.StatusCode = 403;
                context.Result = new JsonResult {
                    Data = new {
                        Error = "NotAuthorized"
                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
            } else {
                context.Result = new RedirectResult("~/Home/Index");
            }
        }
    }
}
