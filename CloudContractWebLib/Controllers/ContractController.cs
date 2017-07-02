using System;
using System.Collections.Generic;
using CloudContractWebLib.Models;
using ClownFish.Base;
using ClownFish.Base.Http;
using ClownFish.Data;
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
            return new PageResult("~/views/Contract/edit.cshtml", new
            {
                ContractGuid = Guid.Empty,
                TemplateGuid = templateGuid,
            });
        }

        [PageUrl(Url = "/contract/edit.aspx")]
        public IActionResult Edit(Guid contractGuid)
        {
            return new PageResult("~/views/Contract/edit.cshtml", new
            {
                ContractGuid = contractGuid,
            });
        }

        /// <summary>
        /// 合同列表
        /// </summary>
        [PageUrl(Url = "/contract/get-contracts.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public List<Contract> GetList()
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                return CPQuery.Create(@"
SELECT  ContractGUID ,
        ContractName ,
        ContractTemplateGUID
FROM    [dbo].[Geek_Contract]
WHERE   ApproveStatus IS NULL
        OR ApproveStatus = '不通过'").ToList<Contract>();
            }
        }


        /// <summary>
        /// 读取单个合同
        /// </summary>
        [PageUrl(Url = "/contract/get-contract.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public Contract GetContract(Guid contractGuid)
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                return CPQuery.Create(@"
SELECT  *
FROM    [dbo].[Geek_Contract]
WHERE   ContractGUID=@ContractGUID", new { ContractGUID = contractGuid }).ToSingle<Contract>();
            }
        }


        /// <summary>
        /// 合同保存
        /// </summary>
        /// <param name="data">合同</param>
        [PageUrl(Url = "/contract/save.aspx")]
        [Action(Verb = "POST")]
        public Guid Save(string data)
        {
            ContractSaveModel model = data.FromJson<ContractSaveModel>();

            // 入参校验
            if (model == null)
                throw new ArgumentNullException(nameof(model));

            Contract contract = model.contract;
            List<ContractTerm> terms = model.terms;

            // 入参校验
            if (contract == null)
                throw new ArgumentNullException(nameof(contract));

            string sql;

            if (contract.ContractGUID == Guid.Empty)
            {
                contract.ContractGUID = Guid.NewGuid();
                sql = @"
INSERT  INTO [dbo].[Geek_Contract]
        ( [ContractGUID] ,
          [CreatedTime] ,
          [CreatedGUID] ,
          [CreatedName] ,
          [ModifiedTime] ,
          [ModifiedGUID] ,
          [ModifiedName] ,
          [FirstPattern] ,
          [SecondPattern] ,
          [ThirtyPattern] ,
          [ContractName] ,
          [ContractTemplateGUID] ,
          [ContractAmount],
		  [ContractContent],
		  [ProjectName],
		  [SignedDate]
        )
VALUES  ( @ContractGUID ,
          GETDATE() ,
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8' ,
          '系统管理员' ,
          GETDATE() ,
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8' ,
          '系统管理员' ,
          @FirstPattern ,
          @SecondPattern ,
          @ThirtyPattern ,
          @ContractName ,
          @ContractTemplateGUID ,
          @ContractAmount,
          @ContractContent,
		  @ProjectName,
		  @SignedDate
        )";
            }
            else
            {
                sql = @"
UPDATE  [dbo].[Geek_Contract]
SET     [ModifiedTime] = GETDATE() ,
        [ModifiedGUID] = '4230BC6E-69E6-46A9-A39E-B929A06A84E8' ,
        [ModifiedName] = '系统管理员' ,
        [FirstPattern] = @FirstPattern ,
        [SecondPattern] = @SecondPattern ,
        [ThirtyPattern] = @ThirtyPattern ,
        [ContractName] = @ContractName ,
        [ContractAmount] = @ContractAmount,
		[ContractContent] = @ContractContent,
		[ProjectName] = @ProjectName,
		[SignedDate] = @SignedDate
WHERE   ContractGUID = @ContractGUID";
            }

            if (terms.Count > 0)
            {
                foreach (var term in terms)
                {
                    SaveTerm(term, contract.ContractGUID);
                }
            }

            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                CPQuery.Create(sql, contract).ExecuteNonQuery();
            }

            return contract.ContractGUID;
        }

        [PageUrl(Url = "/contract/get-terms.aspx")]
        [Action(OutFormat = SerializeFormat.Json, Verb = "POST")]
        public List<ContractTerm> GetTermList(Guid contractGuid)
        {
            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                return CPQuery.Create(@"
SELECT  ContractTermGUID ,
        ApproveTime ,
        ApproveStatus ,
        ApproverGUID ,
        ApproverName ,
        TermToField ,
        TermContent ,
        CheckContent
FROM    dbo.[Geek_ContractTerm]
WHERE   ContractGuid = @ContractGuid", new { ContractGuid = contractGuid }).ToList<ContractTerm>();
            }
        }

        /// <summary>
        /// 保存合同条款
        /// </summary>
        /// <param name="term">条款</param>
        /// <param name="contractGuid">合同Guid</param>
        private void SaveTerm(ContractTerm term, Guid contractGuid)
        {
            string sql;

            term.ContractGuid = contractGuid;

            if (term.ContractTermGUID == Guid.Empty)
            {
                sql = @"
INSERT  INTO [dbo].[Geek_ContractTerm]
        ( [ContractTermGUID] ,
          [CreatedTime] ,
          [CreatedGUID] ,
          [CreatedName] ,
          [ModifiedTime] ,
          [ModifiedGUID] ,
          [ModifiedName] ,
          [ContractGuid] ,
          [TermToField] ,
          [TermContent]
        )
VALUES  ( NEWID() ,
          GETDATE() ,
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8' ,
          '系统管理员' ,
          GETDATE() ,
          '4230BC6E-69E6-46A9-A39E-B929A06A84E8' ,
          '系统管理员' ,
          @ContractGuid ,
          @TermToField ,
          @TermContent
        )";
            }
            else
            {
                sql = @"
UPDATE  [dbo].[Geek_ContractTerm]
SET     [ModifiedTime] = GETDATE() ,
        [ModifiedGUID] = '4230BC6E-69E6-46A9-A39E-B929A06A84E8' ,
        [ModifiedName] = '系统管理员' ,
        [TermContent] = @TermContent ,
        [ApproveTime] = NULL ,
        [ApproveStatus] = NULL ,
        [ApproverGUID] = NULL ,
        [ApproverName] = NULL
WHERE   ContractTermGUID = @ContractTermGUID";
            }

            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                CPQuery.Create(sql, term).ExecuteNonQuery();
            }
        }
    }
}
