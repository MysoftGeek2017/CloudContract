using CloudContractWebLib.Models;
using ClownFish.Web;

namespace CloudContractWebLib.Controllers
{
    /// <summary>
    /// 模板控制器
    /// </summary>
    public class TemplateController : BaseController
    {
        [PageUrl(Url = "/template-index.aspx")]
        public IActionResult Index()
        {
            return new PageResult("~/views/Template/index.cshtml");
        }

        [PageUrl(Url = "/template-addnew.aspx")]
        public IActionResult AddNew()
        {
            return new PageResult("~/views/Template/addnew.cshtml");
        }

        [PageUrl(Url = "/template-save.aspx")]
        public void Save(ContractTemplate template)
        {

        }
    }
}
