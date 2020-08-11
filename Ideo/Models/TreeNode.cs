using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ideo.Models
{
    public class TreeNode
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentId { get; set; }
        public bool IsFolder { get; set; }
    }
}