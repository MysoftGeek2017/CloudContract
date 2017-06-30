using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using ClownFish.Web;

namespace DemoServiceLib.Controllers
{
	public class TestController : BaseController
	{

		[PageUrl(Url = "/index.aspx")]
		public IActionResult Index()
		{
			return new PageResult("~/views/Test/index.cshtml");
		}

		[PageUrl(Url = "/test.aspx")]
		public string Test()
		{
			return "test";
		}

		[PageUrl(Url = "/create-template.aspx")]
		public IActionResult CreateTemplate()
		{
			return new PageResult("~/views/Test/create_template.cshtml");
		}


		[PageUrl(Url = "/get-username.aspx")]
		public string GetUserName()
		{
			return HttpContext.Current.User?.Identity?.Name;
		}


		[PageUrl(Url = "/save-template.aspx")]
		public void SaveDoc(string content, string name)
		{
			var path = Path.Combine(Context.Server.MapPath("App_Data"), name + ".OoXml");
			File.WriteAllText(path, content);
		}


		// 获取模板列表
		[PageUrl(Url = "/get-template-list.aspx")]
		public List<string> GetTemplateList()
		{
			var dataPath = Context.Server.MapPath("App_Data");
			if( Directory.Exists(dataPath) == false )
				return new List<string>();

			var files = Directory.GetFiles(dataPath, "*.OoXml", SearchOption.TopDirectoryOnly);
			var result = new List<string>();

			foreach( var file in files ) {
				result.Add(Path.GetFileNameWithoutExtension(file));
			}
			return result;
		}

		[PageUrl(Url = "/get-template-content.aspx")]
		public string GetTemplateContent(string name)
		{
			var path = Path.Combine(Context.Server.MapPath("App_Data"), name + ".OoXml");
			if( File.Exists(path) == false )
				throw new FileNotFoundException();

			return File.ReadAllText(path);
		}

		// 模板列表页面
		[PageUrl(Url = "/template-list.aspx")]
		public IActionResult TemplateList()
		{
			return new PageResult("~/views/Test/template_list.cshtml", GetTemplateList());
		}


	}
}