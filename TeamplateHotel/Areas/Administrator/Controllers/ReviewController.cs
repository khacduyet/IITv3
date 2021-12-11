using ProjectLibrary.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TeamplateHotel.Areas.Administrator.Controllers
{
    public class ReviewController : Controller
    {
        //
        // GET: /Administrator/Review/

        public ActionResult Index(int? id)
        {
            using (var db = new MyDbDataContext())
            {
                ViewBag.Messages = CommentController.Messages(TempData["Messages"]);
                ViewBag.Title = "Trang đánh giá phòng";
                ViewBag.ReviewId = id;
                return View();
            }
        }

        [HttpPost]
        public JsonResult List(int id, int jtStartIndex = 0, int jtPageSize = 0, string jtSorting = null)
        {
            try
            {
                using (var db = new MyDbDataContext())
                {
                    // RoomId = BlogId :))
                    var listRv = db.Reviews.Where(x => x.BlogId == id).ToList();
                    var records = listRv.Select(a => new
                    {
                        Id = a.Id,
                        BlogId = a.BlogId,
                        Comment1 = a.Comment,
                        Email = a.Email,
                        FullName = a.FullName,
                        Status = a.Status,
                        DateCreated = a.DateCreated
                    }).OrderBy(a => a.Id).Skip(jtStartIndex).Take(jtPageSize).ToList();
                    //Return result to jTable
                    return Json(new { Result = "OK", Records = records, TotalRecordCount = listRv.Count() });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", ex.Message });
            }
        }

        [HttpPost]
        public JsonResult Delete(int id)
        {
            try
            {
                using (var db = new MyDbDataContext())
                {
                    Review del = db.Reviews.FirstOrDefault(c => c.Id == id);
                    if (del != null)
                    {
                        db.Reviews.DeleteOnSubmit(del);
                        db.SubmitChanges();
                        return Json(new { Result = "OK", Message = "Xóa đánh giá thành công" });
                    }
                    return Json(new { Result = "ERROR", Message = "Đánh giá không tồn tại" });
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR", ex.Message });
            }
        }
        public JsonResult Approved(int id = 0, bool val = true)
        {
            var db = new MyDbDataContext();
            try
            {
                Review cmt = db.Reviews.FirstOrDefault(b => b.Id == id);
                if (cmt != null)
                {
                    cmt.Status = !val;
                    db.SubmitChanges();
                    return Json(new { Result = "The Review status update was successfull" }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new { Result = "Không tồn tại" }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new { Result = "ERROR " + ex.Message });
            }
        }

    }
}
