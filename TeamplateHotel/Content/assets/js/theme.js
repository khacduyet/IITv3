var preloader = (function () {

    // Variables
    var $window = $(window);
    var loader = $("#loader-wrapper");

    // Methods
    $window.on({
        'load': function () {

            loader.fadeOut();

        }
    });

    // Events

})();

// OWL CAROUSEL
$('.our-gallery-1').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    navText: ["prev", "next"],
    autoplay: true,
    autoplayTimeout: 3000,
    dots: true,
    dotsEach: true,
    // center: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 3
        },
        1000: {
            items: 3
        },
        1025: {
            items: 3
        },
        1400: {
            items: 4
        }
    }
});
$('.our-gallery-10').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    // dotsEach:true,
    // center:true,
    // infinite: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
        0: {
            items: 1
        },
        481: {
            items: 1
        },
        600: {
            items: 1
        },
        769: {
            items: 2
        },
        812: {
            items: 2
        },
        1000: {
            items: 3
        },
        1025: {
            items: 4
        },
        1400: {
            items: 4
        }
    }
});


$('.our-gallery-2').owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    autoplay: true,
    autoplayTimeout: 3000,
    dots: 3,
    dotsEach: true,
    // center:true,
    infinite: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        769: {
            items: 1
        },
        1000: {
            items: 2
        },
        1025: {
            items: 2
        },
        1400: {
            items: 2
        }
    }
});

$('.room-detail-1').owlCarousel({
    loop: true,
    margin: 10,
    nav: false,
    dots: 3,
    dotsEach: true,
    autoplay: true,
    autoplayTimeout: 3000,
    // center:true,
    infinite: true,
    responsive: {
        0: {
            items: 1
        },
        600: {
            items: 1
        },
        769: {
            items: 1
        },
        1000: {
            items: 1
        },
        1025: {
            items: 1
        },
        1400: {
            items: 1
        }
    }
});



$(function () {
    $(".section-date-home #datepicker").datepicker({ dateFormat: "dd MM yy", minDate: new Date() });
});
$(function () {
    $(".section-date-home #datepicker2").datepicker({ dateFormat: "dd MM yy", minDate: new Date() });
});

// Lightbox
lightbox.option({
    'resizeDuration': 200,
    'wrapAround': true
});

// GALLERY
var tabLinks = document.querySelectorAll(".tablinks");
var tabContent = document.querySelectorAll(".tabcontent");

tabLinks.forEach(function (element) {
    element.addEventListener("click", openTabs);
});

$(".tablinks").click(function () {
    $('.tabcontent .gallery-image img').animate({ left: '250px' });
});

function openTabs(element) {
    var btn = element.currentTarget;
    var electronic = btn.dataset.electronic;

    tabContent.forEach(function (element) {
        element.classList.remove("active");
    });

    tabLinks.forEach(function (element) {
        element.classList.remove("active");
    });

    document.querySelector("#" + electronic).classList.add("active");

    btn.classList.add("active");
}

// Make Reservation && Check form Index
function setDate() {
    $("#check-in").datepicker("setDate", new Date());
    $("#check-out").datepicker("setDate", new Date());
}
function getDateCID() {
    var lang = $("#check-in").attr("data-language");
    console.log(lang);
    $("#check-in").datepicker($.extend($.datepicker.regional['en'],{
        dateFormat: "dd MM yy",
        changeMonth: true,
        changeYear: true,
        minDate: new Date(),
    }));
}
function getDateCOD() {
    var lang = $("#check-in").attr("data-language");
    console.log(lang);
    $("#check-out").datepicker($.extend($.datepicker.regional['en'],{
        dateFormat: "dd MM yy",
        changeMonth: true,
        changeYear: true,
        minDate: new Date($("#check-in").datepicker("getDate"))
    }));
}

function changeDate() {
    $("#cid").text($("#check-in").val());
    $("#check-in").change(function () {
        $("#cid").text($(this).val());
        calculate();
        getDateCOD();
    });
    $("#cod").text($("#check-out").val());
    $("#check-out").change(function () {
        $("#cod").text($(this).val());
        calculate();
    });
}

function checkTerm() {
    $("#acceptTerm").click(function () {
        var b = $(this).is(":checked");
        if (b) {
            $("#buttonSubmit").prop("disabled", "");
        } else {
            $("#buttonSubmit").prop("disabled", "disabled");
        }
    });
}

function checkPerson() {
    // Check option
    var totalPerson = $("#MaxPeople").val();
    var child = $(".form__ckecking__child").val();
    var adult = $(".form__ckecking__adult").val();
    var intAd = parseInt(adult);
    var intCh = parseInt(child);
    var tt = intAd + intCh;
    $("#form__ckecking__child option").each(function () {
        var ttPer = 0;
        var _this = parseInt($(this).val());
        ttPer = _this + intAd;
        if (ttPer > totalPerson) {
            $(this).attr("disabled", true);
            $(this).css("background-color", "#ccc");
        } else {
            $(this).attr("disabled", false);
            $(this).css("background-color", "#fff");
        }
    });
    $("#form__ckecking__adult option").each(function () {
        var ttPer = 0;
        var _this = parseInt($(this).val());
        ttPer = _this + intCh;
        if (ttPer > totalPerson) {
            $(this).attr("disabled", true);
            $(this).css("background-color", "#ccc");
        } else {
            $(this).attr("disabled", false);
            $(this).css("background-color", "#fff");
        }
    });
    //
    $("#child").text(child);
    $("#adult").text(adult);
}

function calculate() {
    var total = 0;
    // var adults = parseInt($("#adult").val());
    // var childs = parseInt($("#child").val());
    var price = parseInt($("#price").text());
    var cid = $("#check-in").datepicker('getDate');
    var cod = $("#check-out").datepicker('getDate');
    var diff = new Date(cod - cid);
    var days = diff / 1000 / 60 / 60 / 24;
    $("#check-out").datepicker("option", "minDate", null);
    $("#check-out").datepicker("option", "minDate", new Date($("#check-in").datepicker("getDate")));
    if (days < 0) {
        $("#check-out").datepicker("setDate", cid);
        total = price * 1;
        console.log(total);
    } else {
        if (parseInt(days) == 0) {
            total = price * 1;
        } else {
            total = price * parseInt(days);
        }
    }
    $("#total").text(total);
    $("#TotalMoney").val(total);
}