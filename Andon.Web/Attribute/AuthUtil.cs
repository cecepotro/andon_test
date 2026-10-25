using Andon.Core.Entities;
using System;
using System.Web;
using System.Web.Security;

namespace Andon.Web.Attribute {
    public class AuthUtil {

        public static UserAndon GetCurrentUser() {
            int idUser = GetCurrentId();
            UserAndon u = idUser != 0 ? UserAndon.GetById(idUser) : null;
            return u;
        }

        public static int GetCurrentId() {
            int idUser = 0;
            if (HttpContext.Current.User != null) {
                if (HttpContext.Current.User.Identity.IsAuthenticated) {
                    Int32.TryParse(HttpContext.Current.User.Identity.Name, out idUser);
                }
            }
            return idUser;
        }
    }
}
