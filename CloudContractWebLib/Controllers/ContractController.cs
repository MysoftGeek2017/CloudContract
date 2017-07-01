using ClownFish.Web;

namespace CloudContractWebLib.Controllers
{
    /// <summary>
    /// 合同控制器
    /// </summary>
    public class ContractController : BaseController
    {
        [PageUrl(Url = "/contract/index.aspx")]
        public IActionResult Index()
        {
            return new PageResult("~/views/Template/index.cshtml");
        }
    }
}
