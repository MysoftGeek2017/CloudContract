using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudContractWebLib.Models
{
	[Serializable]
	public class ContractSaveModel
	{
		public Contract contract { get; set; }

		public List<ContractTerm> terms { get; set; }
	}
}
