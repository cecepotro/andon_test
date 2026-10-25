using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Andon.Web {
    public class MvcApplication : System.Web.HttpApplication {

        public static string version = System.Configuration.ConfigurationManager.AppSettings["version"].ToString();
        public static string urlSystem = System.Configuration.ConfigurationManager.AppSettings["urlSystem"].ToString();

        protected void Application_Start() {
            AreaRegistration.RegisterAllAreas();
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
