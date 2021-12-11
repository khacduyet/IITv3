using PagedList;
using ProjectLibrary.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TeamplateHotel.Controllers
{
    public class SearchController : Controller
    {
        //
        // GET: /Search/
        [HttpPost]
        public ActionResult Index(string keySearch, int menuId)
        {
            using (var db = new MyDbDataContext())
            {
                ViewBag.Menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                var dbTags = db.Tags.Where(x => x.Status && x.IdLanguage == Request.Cookies["LanguageID"].Value).ToList();
                var ACom = db.Comments.Where(x => x.Status).ToList();

                List<Article> articles = new List<Article>();


                List<Menu> menu = db.Menus.Where(a => a.ParentID == menuId).ToList();
                foreach (var item in menu)
                {
                    List<Article> a = db.Articles.Where(x => x.MenuID == item.ID && x.Status && x.Title.Contains(keySearch)).ToList();
                    foreach (var i in a)
                    {
                        articles.Add(i);
                    }
                }
                foreach (var article in articles)
                {
                    article.MenuAlias = article.Menu.Alias;
                }
                ViewBag.listArt = null;
                ViewBag.tagsAnother = dbTags;
                ViewBag.ACom = ACom;
                ViewBag.tags = db.Tags.Where(x => x.IdLanguage == Request.Cookies["LanguageID"].Value && x.Status).ToList();
                return View(articles);
            }
        }
        [HttpPost]
        public PartialViewResult searchTag(int menuId, int? tag, int? page)
        {
            using (var db = new MyDbDataContext())
            {
                ViewBag.Menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                page = page ?? 1;
                int pageSize = 3;
                var ACom = db.Comments.Where(x => x.Status).ToList();
                List<Article> articles = new List<Article>();
                var artTag = db.ArticleTags.ToList();
                foreach (var item in artTag)
                {
                    string[] arr = item.Tags.Split(',').ToArray();
                    foreach (var t in arr)
                    {
                        if (t.Equals(tag.ToString()))
                        {
                            articles.Add(db.Articles.Where(x => x.ID == item.ArticleId).FirstOrDefault());
                            break;
                        }
                    }
                }
                ViewBag.ACom = ACom;
                return PartialView("PartialView/ListArticles", articles.ToPagedList(page.Value, pageSize));
            }
        }

        [HttpPost]
        public PartialViewResult searchCategories(int menuId, int? page)
        {
            using (var db = new MyDbDataContext())
            {
                ViewBag.Menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                page = page ?? 1;
                int pageSize = 3;
                var ACom = db.Comments.Where(x => x.Status).ToList();
                List<Article> articles = db.Articles.Where(x => x.Status && x.MenuID == menuId).ToList();
                ViewBag.ACom = ACom;
                return PartialView("PartialView/ListArticles", articles.ToPagedList(page.Value, pageSize));
            }
        }
    }
}
