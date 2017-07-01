using System;
using ClownFish.Web;

namespace CloudContractWebLib.Controllers
{
	/// <summary>
	/// 合同控制器
	/// </summary>
	public class ContractController : BaseController
	{

		[PageUrl(Url = "/contract/create.aspx")]
		public IActionResult Create(Guid templateGuid)
		{
			return new PageResult("~/views/Contract/edit.cshtml", new {
				ContractGuid = Guid.Empty,
				TemplateGuid = templateGuid,
			});
		}
	}
}
