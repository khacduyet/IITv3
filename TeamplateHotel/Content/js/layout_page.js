$(document).ready(function () {
    var pathname = window.location.pathname;
    $('#nav-nemu > li > a[href="' + pathname + '"]').parent().addClass('active');
    $(window).scroll(function(){
        if ($(window).scrollTop() >= 300) {
            $(".navbar").css("margin-bottom","0px")
            $("#style-navbar").addClass('bar-menu-header');
            $(".header-top").css("display", "none"); 
            $(".header-area").css("margin-top", "0");
            
        } else {
            $("#style-navbar").removeClass('bar-menu-header');
            $(".header-top").css("display", "block");
          
        }
    });
    
        $(function () {
       
            $(".datepicker1").datepicker({
                minDate: 0
            });
            $(".datepicker2").datepicker({
                minDate: 1
            });

        });
    
        $("#owl-demo1").owlCarousel({
            loop: false,
            margin: 30,
            responsiveClass: true,
            autoplay: true,
            items: 3,
            dots: false,
            nav: true,
            navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 3
                }
            }
        });
        $("#tour-detail").owlCarousel({
            loop: false,
            margin: 30,
            responsiveClass: true,
            autoplay: true,
            items: 4,
            dots: false,
            nav: false,
            //navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                1000: {
                    items: 4
                }
            }
        });
        $("#owl-demo").owlCarousel({
            loop: false,
            margin: 0,
            responsiveClass: true,
            autoplay:true,
            items: 4, //10 items above 1000px browser width
            dots: false,
            nav: false,
            //navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 3
                },
                1000: {
                    items: 4
                }
            }
        });
      
        //Two Item Slider
        if ($('.two-item-carousel').length) {
            $('.two-item-carousel').owlCarousel({
                loop: true,
                margin: 0,
                nav: false,
                dots: false,
                smartSpeed: 700,
                autoplay: 4000,
                //navText: ['<span class="fa fa-angle-left"></span>', '<span class="fa fa-angle-right"></span>'],
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    800: {
                        items: 1
                    },
                    1024: {
                        items: 2
                    },
                    1200: {
                        items: 2
                    }
                }
            });
        }

        //Tabs Box
        if ($('.prod-tabs .tab-btn').length) {
            $('.prod-tabs .tab-btn').on('click', function (e) {
                e.preventDefault();
                var target = $($(this).attr('href'));
                $('.prod-tabs .tab-btn').removeClass('active-btn');
                $(this).addClass('active-btn');
                $('.prod-tabs .tab').fadeOut(0);
                $('.prod-tabs .tab').removeClass('active-tab');
                $(target).fadeIn(500);
                $(target).addClass('active-tab');
            });
        }
    // Custom Navigation Events
        $(".customNavigation li #next1").click(function () {
            owl.trigger('#next1');
        });
        $(".customNavigation li #prev1").click(function () {
            owl.trigger('#prev1');
        });
  
        $(".disabled .owl-prev").text("").addClass("glyphicon-menu-left");
        $(".disabled .owl-next").text("").addClass("glyphicon-menu-right");

         var d = new Date();

         $(".check-datetime").on("change", function () {
             
             if (d.getMonth(3)) {
                 $(".show-price").text("$300");
                }
             else if (d.getMonth(5)) {
                 $(".show-price").text("$100");
                 }
         });


    //booking
    // Contact form
         var form = $('#main-contact-form');
         form.submit(function (event) {
             event.preventDefault();
             var form_status = $('<div class="form_status"></div>');
             $.ajax({
                 url: $(this).attr('action'),

                 beforeSend: function () {
                     form.prepend(form_status.html('<p><i class="fa fa-spinner fa-spin"></i> Email is sending...</p>').fadeIn());
                 }
             }).done(function (data) {
                 form_status.html('<p class="text-success">' + data.message + '</p>').delay(3000).fadeOut();
             });
         });
    //console.log($('#form1').height());
    //$('iframe#frame-booking').height($('#form1').height);
});