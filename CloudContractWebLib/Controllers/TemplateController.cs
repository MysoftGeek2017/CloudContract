using ClownFish.Web;

namespace CloudContractWebLib.Controllers
{
    /// <summary>
    /// 模板控制器
    /// </summary>
    public class TemplateController : BaseController
    {
        [PageUrl(Url = "/template/index.aspx")]
        public IActionResult Index()
        {
            return new PageResult("~/views/Template/index.cshtml");
        }
    }
}
