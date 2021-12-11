using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace TeamplateHotel.Areas.Administrator.EntityModel
{
    public class EArtTag
    {
        public int ID { get; set; }
        public int ArticleId { get; set; }
        public string Tags { get; set; }
        [NotMapped]
        public string[] selectedIdArray { get; set; }
    }
}