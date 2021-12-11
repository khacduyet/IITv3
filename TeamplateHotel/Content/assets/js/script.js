$(".tag-list li a").click(function () {
    var tag = $(this).attr("data-id");
    var menuId = $(this).attr("data-menu");
    $.ajax({
        type: "POST",
        url: "/tim-kiem/" + tag,
        data: { menuId: menuId, tag: tag },
        success: function (rs) {
            $("#loader-wrapper").css("display", "block");
            $("html, body").animate({ scrollTop: 0 }, 600);
            window.setTimeout(function () {
                $("#loader-wrapper").css("display", "none");
                if (rs != "") {
                    $("#lstArt").html(rs);
                } else {
                    var str = "<h2>Không có kết quả nào được tìm thấy!</h2>";
                    $("#lstArt").html(str);
                }
            }, 1000);
        }
    });
});
$(".sidebar-categories li a").click(function () {
    var cate = $(this).attr("data-id");
    console.log(cate);
    $.ajax({
        type: "POST",
        url: "/tim-kiem/category/" + cate,
        data: { menuId: cate },
        success: function (rs) {
            $("#loader-wrapper").css("display", "block");
            $("html, body").animate({ scrollTop: 0 }, 600);
            window.setTimeout(function () {
                $("#loader-wrapper").css("display", "none");
                if (rs != "") {
                    $("#lstArt").html(rs);
                } else {
                    var str = "<h2>Không có kết quả nào được tìm thấy!</h2>";
                    $("#lstArt").html(str);
                }
            }, 1000);
        }
    });
});
