using System;

namespace CloudContractWebLib.Models
{
    /// <summary>
    /// 合同
    /// </summary>
    [Serializable]
    public class Contract
    {
        /// <summary>
        /// 合同Guid
        /// </summary>
        public Guid ContractGUID { get; set; }
        /// <summary>
        /// 甲方
        /// </summary>
        public string FirstPattern { get; set; }
        /// <summary>
        /// 乙方
        /// </summary>
        public string SecondPattern { get; set; }
        /// <summary>
        /// 丙方
        /// </summary>
        public string ThirtyPattern { get; set; }
        /// <summary>
        /// 合同名称
        /// </summary>
        public string ContractName { get; set; }
        /// <summary>
        /// 合同模板Guid
        /// </summary>
        public Guid ContractTemplateGUID { get; set; }

		/// <summary>
		/// 合同金额
		/// </summary>
		public decimal ContractAmount { get; set; }

        /// <summary>
        /// 合同内容
        /// </summary>
        public string ContractContent { get; set; }
    }
}
