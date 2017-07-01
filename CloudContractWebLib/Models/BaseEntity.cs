using System;

namespace CloudContractWebLib.Models
{
    /// <summary>
    /// 实体基类
    /// </summary>
    [Serializable]
    public abstract class BaseEntity
    {
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime CreatedTime { get; set; }
        /// <summary>
        /// 创建人Guid
        /// </summary>
        public Guid CreatedGUID { get; set; }
        /// <summary>
        /// 创建人名称
        /// </summary>
        public string CreatedName { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime ModifiedTime { get; set; }
        /// <summary>
        /// 修改人GUID
        /// </summary>
        public Guid ModifiedGUID { get; set; }
        /// <summary>
        /// 修改人名称
        /// </summary>
        public string ModifiedName { get; set; }
    }
}
