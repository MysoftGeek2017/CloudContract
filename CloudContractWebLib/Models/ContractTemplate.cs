﻿using System;

namespace CloudContractWebLib.Models
{
    /// <summary>
    /// 合同模板
    /// </summary>
    [Serializable]
    public class ContractTemplate
    {
        /// <summary>
        /// 模板GUID
        /// </summary>
        public Guid ContractTemplateGUID { get; set; }

        /// <summary>
        /// 模板名称
        /// </summary>
        public string TemplateName { get; set; }

        /// <summary>
        /// 模板内容
        /// </summary>
        public string TemplateContent { get; set; }
    }
}
