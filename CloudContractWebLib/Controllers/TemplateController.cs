﻿using System;
using System.Collections.Generic;
using CloudContractWebLib.Models;
using ClownFish.Base.Http;
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
        // 编辑模板
        [PageUrl(Url = "/template/edit.aspx")]
        public IActionResult Edit(Guid templateGuid)
        {
            return new PageResult("~/views/Template/edit.cshtml");
        }

        [PageUrl(Url = "/template-save.aspx")]
        [Action(Verb = "POST")]
        public Guid Save(string name)
        {
            // 入参校验
            if (string.IsNullOrEmpty(name))
                throw new ArgumentNullException(nameof(name));

            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                int count = CPQuery.Create(@"SELECT COUNT(1) FROM dbo.Geek_ContractTemplate WHERE TemplateName = @Name",
                    new { Name = name }).ExecuteScalar<int>();

                if (count > 0)
                {
                    throw new Exception("模板名称已存在，请调整后再操作。");
                }

                Guid oid = Guid.NewGuid();

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
VALUES(@oid,
          GETDATE(),
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8',
          '系统管理员',
          GETDATE(),
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8',
          '系统管理员',
          @Name
        )", new { oid = oid, Name = name }).ExecuteNonQuery();

                return oid;
            }
        }

        [PageUrl(Url = "/template/update.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public void UpdateTemplate(ContractTemplate template)
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                CPQuery.Create(@"
UPDATE dbo.Geek_ContractTemplate
SET TemplateContent=@TemplateContent
WHERE ContractTemplateGUID=@ContractTemplateGUID
", template).ExecuteNonQuery();
            }

        }

        /// <summary>
        /// 获取模板列表
        /// </summary>
        /// <returns></returns>
        [PageUrl(Url = "/template/get-templates.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public List<ContractTemplate> GetTemplates()
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                return CPQuery.Create(@"
SELECT  ContractTemplateGUID ,
        TemplateName
FROM    dbo.Geek_ContractTemplate
").ToList<ContractTemplate>();
            }
        }

        /// <summary>
        /// 获取模板
        /// </summary>
        /// <param name="templateGuid"></param>
        /// <returns></returns>
        [PageUrl(Url = "/template/get-template.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public ContractTemplate GetTemplate(Guid templateGuid)
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                return CPQuery.Create(@"
SELECT  ContractTemplateGUID ,
        TemplateName,
        TemplateContent
FROM    dbo.Geek_ContractTemplate
WHERE ContractTemplateGUID=@templateGuid
", new { templateGuid }).ToSingle<ContractTemplate>();
            }
        }


        [PageUrl(Url = "/template/get-fields.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public List<FieldInfo> GetFields()
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                return CPQuery.Create(@"
SELECT  field_name_c Text, field_name Field
FROM    dbo.data_dict
WHERE   table_name = 'Geek_Contract'
        AND field_name NOT IN ( 'ApproverGUID','ApproverName','ApproveStatus','ApproveTime', 'CreatedGUID', 'ContractTemplateGUID', 'ContractGUID', 'CreatedTime', 'CreatedName',
                                'ContractContent', 'ModifiedGUID', 'ModifiedTime', 'ModifiedName', 'VersionNumber' )
ORDER BY field_name

").ToList<FieldInfo>();
            }
        }

        [PageUrl(Url = "/template/get-itemfields.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public List<FieldInfo> GetItemFields()
        {
            return new List<FieldInfo>
            {
                new FieldInfo {Field = "terms.PerformRemarks", Text = "履约备注"},
                new FieldInfo {Field = "terms.TechnicRemarks", Text = "技术指标"},
                new FieldInfo {Field = "terms.RewardRemarks", Text = "奖励说明"},
                new FieldInfo {Field = "terms.BreachRemarks", Text = "违约责任"},
                new FieldInfo {Field = "terms.TermRemarks", Text = "条款备注"}
            };
        }
    }
}
