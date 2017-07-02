using System;

namespace CloudContractWebLib.Models
{
    /// <summary>
    /// 合同条款
    /// </summary>
    [Serializable]
    public class ContractTerm
    {
        /// <summary>
        /// 合同条款GUID
        /// </summary>
        public Guid ContractTermGUID { get; set; }

        /// <summary>
        /// 合同GUID
        /// </summary>
        public Guid ContractGuid { get; set; }

        /// <summary>
        /// 条款字段
        /// </summary>
        public string TermToField { get; set; }

        /// <summary>
        /// 条款内容
        /// </summary>
        public string TermContent { get; set; }

        /// <summary>
        /// 审批状态
        /// </summary>
        public string ApproveStatus { get; set; }

        /// <summary>
        /// 审批人
        /// </summary>
        public string ApproverName { get; set; }

        ///// <summary>
        ///// 审批时间
        ///// </summary>
        //public DateTime ApproveTime { get; set; }

        /// <summary>
        /// 审批意见
        /// </summary>
        public string CheckContent { get; set; }
    }
}
