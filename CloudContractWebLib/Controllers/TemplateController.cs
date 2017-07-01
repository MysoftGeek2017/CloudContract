using System.Collections.Generic;
using ClownFish.Data;
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


		[PageUrl(Url = "/template/create.aspx")]
		public IActionResult Create()
		{
			return new PageResult("~/views/template/create.cshtml");
		}


		[PageUrl(Url = "/template/get-fields.aspx")]
		public List<string> GetFields()
		{
			return CPQuery.Create(@"
SELECT  field_name_c
FROM    dbo.data_dict
WHERE   table_name = 'cb_Contract'
ORDER BY field_name
").ToScalarList<string>();
		}
	}
}
