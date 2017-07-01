using ClownFish.Data;
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
        public void Save(string name)
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                CPQuery.Create(@"
INSERT  INTO[dbo].[Geek_ContractTemplate]
        ( [ContractTemplateGUID],
          [CreatedTime],
          [CreatedGUID],
          [CreatedName],
          [ModifiedTime],
          [ModifiedGUID],
          [ModifiedName],
          [TemplateName]
        )
VALUES(NEWID(),
          GETDATE(),
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8',
          '系统管理员',
          GETDATE(),
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8',
          '系统管理员',
          @Name
        )", new { Name = name }).ExecuteNonQuery();

                scope.Commit();
            }
        }
    }
}
