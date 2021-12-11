using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using PagedList;
using ProjectLibrary.Config;
using ProjectLibrary.Database;
using TeamplateHotel.Models;

namespace TeamplateHotel.Controllers
{
    public class HomeController : BasicController
    {
        [HttpGet]
        public ActionResult Index(object aliasMenuSub, object idSub, object aliasSub, int? page, int? adult, int? child)
        {
            var db = new MyDbDataContext();
            Hotel hotel = CommentController.DetailHotel(Request.Cookies["LanguageID"].Value);
            ViewBag.MetaTitle = hotel.MetaTitle;
            ViewBag.MetaDesctiption = hotel.MetaDescription;
            ViewBag.menuArticle = db.Menus.Where(x => x.Status && x.Type == SystemMenuType.Article && x.Level == 0 && x.LanguageID == Request.Cookies["LanguageID"].Value).FirstOrDefault();
            if (aliasMenuSub.ToString() == "System.Object")
            {
                return View("Index");
            }
            if (aliasMenuSub.ToString() == "SelectLanguge")
            {
                Language language = db.Languages.FirstOrDefault(a => a.ID == idSub.ToString());
                if (language == null)
                {
                    language = db.Languages.FirstOrDefault();
                }
                HttpCookie langCookie = Request.Cookies["LanguageID"];
                langCookie.Value = language.ID;
                langCookie.Expires = DateTime.Now.AddDays(10);
                HttpContext.Response.Cookies.Add(langCookie);
                return Redirect("/");
            }

            // xác định menu => tìm ra Kiểu hiển thị của menu
            Menu menu = db.Menus.FirstOrDefault(a => a.Alias == aliasMenuSub.ToString());
            if (menu == null)
            {
                return View("404");
            }
            //Seo
            ViewBag.MetaTitle = menu.MetaTitle;
            ViewBag.MetaDesctiption = menu.MetaDescription;
            ViewBag.Menu = menu;
            ViewBag.MenuHome = db.Menus.Where(x => x.Status && x.Type == SystemMenuType.Home && x.LanguageID == Request.Cookies["LanguageID"].Value).SingleOrDefault();
            switch (menu.Type)
            {
                case SystemMenuType.Article:
                    goto Trangbaiviet;
                case SystemMenuType.RoomRate:
                    goto TrangRoom;
                case SystemMenuType.Booking:
                    return RedirectToAction("MakeReservation", "Booking");
                case SystemMenuType.Contact:
                    Random random = new Random();
                    int iNumber = random.Next(10000, 99999);
                    Session["Captcha"] = iNumber.ToString();
                    return View("Contact");
                case SystemMenuType.Gallery:
                    return View("Gallery", CommentController.Gallery(page));
                case SystemMenuType.Location:
                    //Lấy bài viết Location
                    ViewBag.ArticleByRoomRate = db.Articles.FirstOrDefault(a => a.MenuID == menu.ID);
                    return View("Location");
                case SystemMenuType.About:
                    goto About;
                default:
                    return View("Index");
            }

        #region "Trang bài viết"
        Trangbaiviet:
            var dbTags = db.Tags.Where(x => x.Status && x.IdLanguage == Request.Cookies["LanguageID"].Value).ToList();
            var ACom = db.Comments.Where(x => x.Status).ToList();
            if (idSub.ToString() != "System.Object")
            {
                int idArticle;
                int.TryParse(idSub.ToString(), out idArticle);
                DetailArticle detailArticle = CommentController.Detail_Article(idArticle);
                ViewBag.MetaTitle = detailArticle.Article.MetaTitle;
                ViewBag.MetaDesctiption = detailArticle.Article.MetaDescription;
                // start
                List<Tag> tags = new List<Tag>();
                var artTags = db.ArticleTags.Where(x => x.ArticleId == detailArticle.Article.ID).SingleOrDefault();
                if (artTags != null)
                {
                    string[] arr = artTags.Tags.Split(',').ToArray();
                    foreach (var item in arr)
                    {
                        foreach (var t in dbTags)
                        {
                            if (t.Id.ToString().Equals(item))
                            {
                                tags.Add(t);
                            }
                        }
                    }
                    ViewBag.tags = tags;
                } else
                {
                    ViewBag.tags = null;
                }
                ViewBag.tagsAnother = dbTags;
                var listCom = db.Comments.Where(x => x.BlogId == detailArticle.Article.ID && x.Status).ToList();
                ViewBag.modelCom = listCom;
                ViewBag.ACom = ACom;
                return View("Article/DetailArticle", detailArticle);
            }
            //Danh sách bài viết
            IPagedList<Article> articles = CommentController.GetArticles(menu.ID, page);
            ViewBag.listArt = null;
            ViewBag.tagsAnother = dbTags;
            ViewBag.ACom = ACom;
            ViewBag.tags = db.Tags.Where(x=>x.IdLanguage == Request.Cookies["LanguageID"].Value && x.Status).ToList();
            return View("Article/ListArticle", articles);
        #endregion

        //Trường hợp: Room
        #region "Kiểu Room & rate"
        TrangRoom:
            if (idSub.ToString() != "System.Object")
            {
                int id;
                int.TryParse(idSub.ToString(), out id);
                //Kiểm tra xem alias truyền đến có phải là 1 bài viết không
                var articleRoom = db.Articles.FirstOrDefault(a => a.ID == id);
                if (articleRoom != null)
                {
                    ViewBag.MetaTitle = articleRoom.MetaTitle;
                    ViewBag.MetaDesctiption = articleRoom.MetaDescription;
                    return View("Article/DetailArticle", CommentController.Detail_Article(id));
                }
                //chi tiết Room
                DetailRoom detailRoom = CommentController.Detail_Room(id, menu.ID);
                ViewBag.MetaTitle = detailRoom.Room.MetaTitle;
                ViewBag.MetaDesctiption = detailRoom.Room.MetaDescription;
                var listRev = db.Reviews.Where(x => x.BlogId == detailRoom.Room.ID && x.Status).ToList();
                ViewBag.modelRev = listRev;
                return View("Room/DetailRoom", detailRoom);
            }
            //Lấy bài viết RoomRate
            var articlrByRoomRate = db.Articles.FirstOrDefault(a => a.MenuID == menu.ID);
            if (articlrByRoomRate != null)
            {
                articlrByRoomRate.MenuAlias = articlrByRoomRate.Menu.Alias;
            }
            if (adult != null && child != null)
            {
                return View("Room/ListRoom", CommentController.GetRooms(menu.ID, page, adult.Value, child.Value));
            }
            ViewBag.ArticleByRoomRate = articlrByRoomRate;
            return View("Room/ListRoom", CommentController.GetRooms(menu.ID,page));
        #endregion

        #region About
        About:
            return View("About");
        #endregion
        }
    }
}