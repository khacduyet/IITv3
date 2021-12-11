using System;
using System.Collections.Generic;
using System.Linq;
using PagedList;
using ProjectLibrary.Config;
using ProjectLibrary.Database;
using TeamplateHotel.Handler;
using TeamplateHotel.Models;

namespace TeamplateHotel.Controllers
{
    public class CommentController : BasicController
    {

        //danh sach ngon ngu
        public static List<Language> GetLanguages()
        {
            using (var db = new MyDbDataContext())
            {
                List<Language> languages = db.Languages.ToList();
                return languages;
            }
        }
        //Chi tiết khách sạn
        public static Hotel DetailHotel(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                var hotel =
                    db.Hotels.FirstOrDefault(a => a.LanguageID == languageKey) ??
                    new Hotel();
                return hotel;
            }
        }
        //Danh sách Main menu
        public static List<Menu> GetMainMenus(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                List<Menu> menus = db.Menus.Where(a => a.Status && a.Location == SystemMenuLocation.MainMenu &&
                                                       a.LanguageID == languageKey).OrderBy(a => a.Index).ToList();
                return menus;
            }
        }
        // Get menu child 
        public static List<Menu> getMenuChild(string languageKey, int menuId)
        {
            using (var db = new MyDbDataContext())
            {
                List<Menu> mnu = db.Menus.Where(a => a.Location == SystemMenuLocation.MainMenu &&
                                                       a.LanguageID == languageKey && a.ParentID == menuId).OrderBy(a => a.Index).ToList();
                return mnu;
            }
        }

        //Danh sách Second menu
        public static List<Menu> GetSecondMenus(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                List<Menu> menufooter = db.Menus.Where(a => a.Status && a.Location == SystemMenuLocation.SecondMenu &&
                                                       a.LanguageID == languageKey).ToList();
                return menufooter;
            }
        }
        // LIST GALLERY
        public static List<Gallery> lstGallery()
        {
            using (var db = new MyDbDataContext())
            {
                List<Gallery> galleries = db.Galleries.OrderBy(a => a.Index).ToList();
                return galleries;
            }
        }
        //Danh sách Second menu
        public static IPagedList<Gallery> Gallery(int? page)
        {
            using (var db = new MyDbDataContext())
            {
                List<Gallery> galleries = db.Galleries.OrderBy(a => a.Index).ToList();
                int pageNumber = (page ?? 1);
                int pageSize = 24;
                return galleries.ToPagedList(pageNumber, pageSize);
            }
        }
        public static List<RoomGallery> RoomGallery()
        {
            using (var db = new MyDbDataContext())
            {
                List<RoomGallery> roomGalleries = db.RoomGalleries.ToList();
                return roomGalleries;
            }
        }
        //get plugin
        public static Plugin GetPluigPlugin()
        {
            using (var db = new MyDbDataContext())
            {
                return db.Plugins.FirstOrDefault() ?? new Plugin();
            }
        }
        //Danh sach slider
        public static List<Slider> GetListSlider(string languageKey, int menuId = 0)
        {
            using (var db = new MyDbDataContext())
            {
                List<Slider> sliders = db.Sliders.Where(a => a.LanguageID == languageKey && a.Status).ToList();
                List<Slider> sliderIsChoise = new List<Slider>();

                //lấy banner theo menu
                var menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                if (menu != null)
                {
                    foreach (var slider in sliders)
                    {
                        if (slider.MenuIDs.Length > 0)
                        {
                            int[] menuIds =
                                slider.MenuIDs.Substring(0, slider.MenuIDs.Length - 1).Split(',').Select(
                                    n => Convert.ToInt32(n)).ToArray();

                            if (menuIds.Contains(menu.ID))
                            {
                                sliderIsChoise.Add(slider);
                            }
                        }
                    }
                }
                else
                {
                    //lấy menu theo trang chủ
                    var menuHome = db.Menus.FirstOrDefault(a => a.Type == SystemMenuType.Home);
                    if (menuHome != null)
                    {
                        foreach (var slider in sliders)
                        {
                            if (slider.MenuIDs.Length > 0)
                            {
                                int[] menuIds =
                           slider.MenuIDs.Substring(0, slider.MenuIDs.Length - 1).Split(',').Select(
                               n => Convert.ToInt32(n)).ToArray();

                                if (menuIds.Contains(menuHome.ID))
                                {
                                    sliderIsChoise.Add(slider);
                                }
                            }
                        }
                    }
                }
                if (sliderIsChoise.Count == 0)
                {
                    sliderIsChoise = sliders;
                }
                return sliderIsChoise;
                //lấy menu hiển thị tất cả
            }
        }


        //Danh sach quang cao
        public static List<Advertising> GetAdvertisings()
        {
            using (var db = new MyDbDataContext())
            {
                List<Advertising> advertisings = db.Advertisings.Where(a => a.Status).ToList();
                return advertisings;
            }
        }

        //Danh sách bài viết theo chuyên mục
        public static IPagedList<Article> GetArticles(int menuId, int? page)
        {
            using (var db = new MyDbDataContext())
            {
                List<Article> articles = new List<Article>();

                List<Menu> menu = db.Menus.Where(a => a.ParentID == menuId).ToList();
                foreach (var item in menu)
                {
                    List<Article> a = db.Articles.Where(x => x.MenuID == item.ID && x.Status).ToList();
                    foreach (var i in a)
                    {
                        articles.Add(i);
                    }
                }
                foreach (var article in articles)
                {
                    article.MenuAlias = article.Menu.Alias;
                }
                int pageNumber = (page ?? 1);
                int pageSize = 3;
                return articles.ToPagedList(pageNumber, pageSize);
            }
        }
        //Bai viet mới
        public static List<ShowObject> NewArticles(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                List<ShowObject> articleHots = db.Articles.Where(a => a.New && a.Status)
                        .Join(db.Menus.Where(a => a.LanguageID == languageKey), a => a.MenuID, b => b.ID,
                            (a, b) => new ShowObject
                            {
                                ID = a.ID,
                                Alias = a.Alias,
                                MenuAlias = b.Alias,
                                Title = a.Title,
                                DateCreated = a.DateCreated,
                                Index = a.Index,
                                Image = a.Image,
                                Description = a.Description,
                                //Content = a.Content
                            }).OrderByDescending(a => a.ID).Take(10).ToList();
                foreach (var item in articleHots)
                {
                    int count = 0;
                    foreach (var cmt in db.Comments.Where(x => x.Status && x.BlogId == item.ID))
                    {
                        count++;
                    }
                    item.CountComment = count;
                }
                return articleHots;
            }
        }
        //Chi tiết bài viết
        public static DetailArticle Detail_Article(int id)
        {
            using (var db = new MyDbDataContext())
            {
                Article article = db.Articles.FirstOrDefault(a => a.ID == id && a.Status) ?? new Article();
                List<Article> articles = db.Articles.Where(a => a.MenuID == article.MenuID && a.Status && a.ID != article.ID).OrderBy(a => a.Index).ToList();
                foreach (var item in articles)
                {
                    item.MenuAlias = article.Menu.Alias;
                }
                DetailArticle detailArticle = new DetailArticle()
                {
                    Article = article,
                    Articles = articles
                };
                return detailArticle;
            }
        }
        //Danh sách phòng
        public static List<Room> lstRoom(int Type, string lang)
        {
            using (var db = new MyDbDataContext())
            {
                var menu = db.Menus.FirstOrDefault(a => a.Type == Type && a.Level == 0 && a.LanguageID == lang);
                List<Room> rooms = db.Rooms.Where(a => a.Status && a.LanguageID == menu.LanguageID).OrderBy(a => a.Index).ToList();

                foreach (var item in rooms)
                {
                    if (menu.LanguageID.Equals("vi"))
                    {
                        item.Price = item.Price * GetPriceUSD.USDToVND();
                    }
                    item.MenuAlias = menu.Alias;
                }

                return rooms;
            }
        }
        public static IPagedList<Room> GetRooms(int menuId, int? page)
        {
            using (var db = new MyDbDataContext())
            {
                var menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                List<Room> rooms = db.Rooms.Where(a => a.Status && a.LanguageID == menu.LanguageID).OrderBy(a => a.Index).ToList();

                foreach (var room in rooms)
                {
                    room.MenuAlias = menu.Alias;
                    room.roomGalleries = db.RoomGalleries.Where(a => a.RoomId == room.ID).ToList();
                    if (menu.LanguageID.Equals("vi"))
                    {
                        room.Price = room.Price * GetPriceUSD.USDToVND();
                    }
                }
                page = page ?? 1;
                int pageSize = 3;
                return rooms.ToPagedList(page.Value, pageSize);
            }
        }
        public static IPagedList<Room> GetRooms(int menuId, int? page, int adult, int child)
        {
            using (var db = new MyDbDataContext())
            {
                var menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                List<Room> rooms = db.Rooms.Where(a => a.Status && a.LanguageID == menu.LanguageID && a.MaxPeople >= (adult + child)).OrderBy(a => a.Index).ToList();

                foreach (var room in rooms)
                {
                    room.MenuAlias = menu.Alias;
                    room.roomGalleries = db.RoomGalleries.Where(a => a.RoomId == room.ID).ToList();
                    if (menu.LanguageID.Equals("vi"))
                    {
                        room.Price = room.Price * GetPriceUSD.USDToVND();
                    }
                }
                page = page ?? 1;
                int pageSize = 3;
                return rooms.ToPagedList(page.Value, pageSize);
            }
        }
        //Chi tiết phòng
        public static DetailRoom Detail_Room(int id, int menuId)
        {
            using (var db = new MyDbDataContext())
            {
                var menu = db.Menus.FirstOrDefault(a => a.ID == menuId);
                Room room = db.Rooms.FirstOrDefault(a => a.ID == id && a.Status) ?? new Room();
                if (menu.LanguageID.Equals("vi"))
                {
                    room.Price = room.Price * GetPriceUSD.USDToVND();
                }
                List<RoomGallery> roomGalleries = db.RoomGalleries.Where(a => a.RoomId == room.ID).ToList();
                List<Room> rooms = db.Rooms.Where(a => a.Status && a.ID != room.ID && a.LanguageID == menu.LanguageID).OrderBy(a => a.Index).ToList();

                foreach (var item in rooms)
                {
                    item.MenuAlias = menu.Alias;
                    if (menu.LanguageID.Equals("vi"))
                    {
                        item.Price = item.Price * GetPriceUSD.USDToVND();
                    }
                }
                DetailRoom detailRoom = new DetailRoom()
                {
                    Room = room,
                    RoomGalleries = roomGalleries,
                    Rooms = rooms
                };
                return detailRoom;
            }
        }

        ///////////// Trang home ////////////////////////
        //Bai viet welcome
        public static ShowObject WellcomeArticle(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                return
                    db.Articles.Where(a => a.Home && a.Status)
                        .Join(db.Menus.Where(a => a.LanguageID == languageKey), a => a.MenuID, b => b.ID,
                            (a, b) => new ShowObject()
                            {
                                ID = a.ID,
                                Alias = a.Alias,
                                MenuAlias = b.Alias,
                                Title = a.Title,
                                Index = a.Index,
                                Image = a.Image,
                                Description = a.Description
                            }).FirstOrDefault();
            }
        }
        //Bai viet hot
        public static List<ShowObject> HotArticles(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                List<ShowObject> articleHots = db.Articles.Where(a => a.Hot && a.Status)
                        .Join(db.Menus.Where(a => a.LanguageID == languageKey), a => a.MenuID, b => b.ID,
                            (a, b) => new ShowObject
                            {
                                ID = a.ID,
                                Alias = a.Alias,
                                MenuAlias = b.Alias,
                                Title = a.Title,
                                DateCreated = a.DateCreated,
                                Index = a.Index,
                                Image = a.Image,
                                Description = a.Description,
                            }).ToList();
                foreach (var item in articleHots)
                {
                    int count = 0;
                    foreach (var cmt in db.Comments.Where(x => x.Status && x.BlogId == item.ID))
                    {
                        count++;
                    }
                    item.CountComment = count;
                }
                return articleHots;
            }
        }
        //Bai viet Customer
        public static List<ShowObject> CustomerArticles(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                List<ShowObject> CustomerArticle = db.Articles.Where(a => a.Customer && a.Status)
                        .Join(db.Menus.Where(a => a.LanguageID == languageKey), a => a.MenuID, b => b.ID,
                            (a, b) => new ShowObject
                            {
                                ID = a.ID,
                                Alias = a.Alias,
                                MenuAlias = b.Alias,
                                Title = a.Title,
                                Index = a.Index,
                                Image = a.Image,
                                Description = a.Description,
                            }).ToList();
                return CustomerArticle;
            }
        }
        //phòng show home
        public static List<ShowObject> RoomShowHome(string languageKey)
        {
            using (var db = new MyDbDataContext())
            {
                var memu =
                    db.Menus.FirstOrDefault(a => a.Type == SystemMenuType.RoomRate && a.LanguageID == languageKey) ??
                    new Menu();
                List<ShowObject> roomShowHome = db.Rooms.Where(a => a.Home && a.Status && a.LanguageID == languageKey).Select(a => new ShowObject
                {
                    ID = a.ID,
                    Alias = a.Alias,
                    MenuAlias = memu.Alias,
                    Title = a.Title,
                    Index = a.Index,
                    Image = a.Image,
                    Description = a.Description,
                    Price = (double)a.Price,
                }).ToList();
                foreach (var item in roomShowHome)
                {
                    item.Price = item.Price * (double)GetPriceUSD.USDToVND();
                }
                return roomShowHome;
            }
        }

    }
}