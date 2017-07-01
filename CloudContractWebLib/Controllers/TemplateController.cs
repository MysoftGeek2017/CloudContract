using System.Collections.Generic;
using ClownFish.Data;
using ClownFish.Web;
using CloudContractWebLib.Models;
using ClownFish.Base.Http;

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

		/// <summary>
		/// 获取模板列表
		/// </summary>
		/// <returns></returns>
		[PageUrl(Url = "/template/get-templates.aspx")]
		[Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
		public List<string> GetTemplates()
		{
			return new List<string> { "测试模板01" };
		}


		[PageUrl(Url = "/template/get-fields.aspx")]
		[Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
		public List<string> GetFields()
		{
			using( var scope = ConnectionScope.GetExistOrCreate() ) {

				return CPQuery.Create(@"
SELECT  field_name_c
FROM    dbo.data_dict
WHERE   table_name = 'cb_Contract'
ORDER BY field_name
").ToScalarList<string>();
			}
		}
	}
}
