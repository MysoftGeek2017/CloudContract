using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ClownFish.Web;

namespace CloudContractWebLib.Controllers
{
	public sealed class HomeController : BaseController
	{
		[PageUrl(Url = "/index.aspx")]
		public IActionResult Index()
		{
			return new PageResult("~/views/Home/index.cshtml");
		}
	}
}
