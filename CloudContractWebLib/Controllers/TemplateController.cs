using System.Collections.Generic;
using ClownFish.Data;
using ClownFish.Web;
using CloudContractWebLib.Models;

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
