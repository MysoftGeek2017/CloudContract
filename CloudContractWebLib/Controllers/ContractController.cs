using System;
using System.Collections.Generic;
using CloudContractWebLib.Models;
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
        /// 合同保存
        /// </summary>
        [PageUrl(Url = "/contract-save.aspx")]
        [Action(Verb = "POST")]
        public void Save(Contract contract)
        {
            // 入参校验
            if (contract == null)
                throw new ArgumentNullException(nameof(contract));

            string sql;

            if (contract.ContractGUID == Guid.Empty)
            {
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
          [ContractAmount]
        )
VALUES  ( NEWID() ,
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
          @ContractAmount
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
        [ContractAmount] = @ContractAmount
WHERE   ContractGUID = @ContractGUID";
            }

            using (var scope = ConnectionScope.GetExistOrCreate())
            {
                CPQuery.Create(sql, contract).ExecuteNonQuery();
            }
        }
    }
}
