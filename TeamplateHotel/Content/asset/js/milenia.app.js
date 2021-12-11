var Milenia = (function($){
    'use strict';

    var App = {},
        DOMDfd = $.Deferred(),
        $body = $('body'),
        $doc = $(document);

    App.modules = {};
    App.helpers = {};
    App._localCache = {};

    App.ISTOUCH = Modernizr.touchevents;
    App.ANIMATIONDURATION = 500;
    App.ANIMATIONEASING = 'easeOutQuart';
    App.ANIMATIONSUPPORTED = Modernizr.cssanimations;
    App.ANIMATIONEND = "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";
    App.RTL = getComputedStyle(document.body).direction === 'rtl';
    App.ISLEGACYBROWSER = !Modernizr.flexbox;
    App.ISFIREFOX = window.navigator.userAgent.indexOf('Firefox') != -1;

    App.afterDOMReady = function() {
        var self = this;

        // Show message to update legacy browser
        if(this.ISLEGACYBROWSER) {
            if(this.helpers.showCriticalFullScreenMessage) {
                this.helpers.showCriticalFullScreenMessage({
                    before: '<i class="icon icon-sad"></i>',
                    content: 'Your browser does not support some technologies this site use. Please update your browser or visit the site using more modern browser.'
                });
            }

            // Anyway preloader must be used
            if(this.modules.preloader) this.modules.preloader();

            return;
        }

        if(this.modules.backToTop) {
			this.modules.backToTop({
				easing: 'easeOutQuint',
				speed: 550,
				cssPrefix: 'milenia-'
			});
        }

        if(this.helpers.toggledFields) this.helpers.toggledFields();

        if(window.MileniaEventsCalendar) window.MileniaEventsCalendar.init($('.milenia-events-calendar'), {
            isTouch: self.ISTOUCH,
            cssPrefix: 'milenia-',
            breakpoint: 768
        });


        if(window.MileniaSidebarHidden) {
            new window.MileniaSidebarHidden({
                cssPrefix: 'milenia-'
            });
        }

        if(window.MileniaStickyHeaderSection) {
            var $stickySections = $('[class*="milenia-header-section--sticky"]:not([class*="milenia-header-section--sticky-hidden"])');

            if($stickySections.length) {
                new window.MileniaStickyHeaderSection($stickySections, {
                    animationEasing: self.ANIMATIONEASING,
                    animationDuration: self.ANIMATIONDURATION
                });
            }
        }

        if(this.modules.dropdown) this.modules.dropdown.init();

        if(this.modules.fancyboxAlbum) this.modules.fancyboxAlbum.init();

        if(this.modules.hiddenFilters) this.modules.hiddenFilters();

        if(this.modules.fieldCounter) this.modules.fieldCounter();

        if(this.modules.fieldDatepicker) this.modules.fieldDatepicker();

        if(this.modules.WPGallery) this.modules.WPGallery.init($('.gallery'));

        if(this.helpers.bookingFormV2V4) this.helpers.bookingFormV2V4();
        if(this.helpers.bookingFormV3) this.helpers.bookingFormV3();
        if(this.helpers.calendarWidget) this.helpers.calendarWidget();

        var $datepickers = $('.milenia-datepicker'),
            borderBottomDatepickerContainers = '.milenia-booking-form--style-2';

        if($datepickers.length && $.fn.datepicker) {
            $datepickers.datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                isRTL: self.RTL,
                dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
                prevText: self.RTL ? '<i class="icon icon-chevron-right"></i>' : '<i class="icon icon-chevron-left"></i>',
                nextText: self.RTL ? '<i class="icon icon-chevron-left"></i>' : '<i class="icon icon-chevron-right"></i>',
                beforeShow: function(input, instance) {
                    var $input = $(input);

                    if($input.closest(borderBottomDatepickerContainers).length) {
                        instance.dpDiv.addClass('ui-datepicker--bordered-container');
                    }
                    else {
                        instance.dpDiv.removeClass('ui-datepicker--bordered-container');
                    }
                }
            });
        }

        var $selects = $('.milenia-custom-select2');

        if($selects.length && $.fn.select2) {
            $selects.select2({
                width: '100%',
                theme: 'milenia',
                dir: self.RTL ? 'rtl' : 'ltr'
            });
        }

        /* ------------------------------------------------
			Range Slider
		------------------------------------------------ */

            var $rangeSliders = $('.milenia-range-slider');

            if($.fn.slider && $rangeSliders.length) {
                $rangeSliders.slider({
                    range: true,
                    min: 0,
                    max: 999,
                    values: [99, 999],
                    slide: function(event, ui) {
                        var $range = $(ui.handle).closest('.milenia-range-slider'),
                            $input = $range.siblings('.milenia-range-slider-input');

                        if($range.length && $input.length) {
                            $input.attr('value', '$' + $range.slider('values', 0) + '-' + '$' + $range.slider('values', 1))
                                .val('$' + $range.slider('values', 0) + '-' + '$' + $range.slider('values', 1));
                        }
                    }
                });
            }

        /* ------------------------------------------------
			End of Range Slider
		------------------------------------------------ */

        /* ------------------------------------------------
			Twitter
		------------------------------------------------ */

            var $twitterFeed = $('.milenia-twitter-feed');

            if($twitterFeed.length && $.fn.tweetie) {
                $twitterFeed.tweetie({
                    url: 'http://velikorodnov.com/html/milenia/vendors/tweetie/api/php/server.php',
                    type: 'timeline',
                    template: '<li>\
                        <div class="milenia-tweet">\
                            <div class="milenia-tweet-content">{{tweet.text}}</div>\
                            <footer class="milenia-tweet-footer">\
                                {{tweet.created_at}}\
                            </footer>\
                        </div>\
                    </li>',
                    dateFormat: '%B %d, %Y',
                    params: {
                        count: 3,
                        screen_name: null,
                        list_id: null,
                        slug: null,
                        q: null,
                        exclude_replies: false,
                        include_rts: false
                    }
                })
            }

        /* ------------------------------------------------
			End of Twitter
		------------------------------------------------ */


        /* ------------------------------------------------
			Custom Select
		------------------------------------------------ */

            var $selects = $('.milenia-custom-select');

            if($selects.length){
                $selects.MadCustomSelect({
                    cssPrefix: 'milenia-'
                });
            }

		/* ------------------------------------------------
			End of Custom Select
		------------------------------------------------ */

        /* ------------------------------------------------
            Newsletter Form
        ------------------------------------------------ */

            var newsletterForm = $('.milenia-newsletter-form');

            if(newsletterForm.length && window.MileniaNewsletter) {
                window.MileniaNewsletter(newsletterForm);
            }

        /* ------------------------------------------------
            End of Newsletter Form
        ------------------------------------------------ */

        /* ------------------------------------------------
            Contact Form
        ------------------------------------------------ */

            var contactForm = $('.milenia-contact-form');

            if(contactForm.length && window.MileniaContactForm) {
                MileniaContactForm.init(contactForm);
            }

        /* ------------------------------------------------
            End of Contact Form
        ------------------------------------------------ */

        /* ----------------------------------------
             Fancybox
         ---------------------------------------- */

            if($.fancybox && $.fancybox.defaults) {
                $.extend($.fancybox.defaults, {
                    transitionEffect: "slide",
                    transitionDuration: self.ANIMATIONDURATION,
                    animationDuration: self.ANIMATIONDURATION
                });
            }

        /* ----------------------------------------
             End of Fancybox
         ---------------------------------------- */

        if(this.modules.arcticModals) this.modules.arcticModals.init( $('[data-arctic-modal]') );

        /* ------------------------------------------------
				Navigation
		------------------------------------------------ */

            var $nav = $('.milenia-navigation'),
                $verticalNav = $('.milenia-navigation-vertical');

            if($nav.length){
                $nav.MonkeysanNav({
                    cssPrefix: 'milenia-'
                });

                $nav.on('submenumobileopened.jquery.nav', function() {
                    self.LinkUnderliner.toUnderline($(this).find('a'));
                });
            }

            if($verticalNav.length){
                $verticalNav.MonkeysanNav({
					cssPrefix: 'milenia-',
					mobileBreakpoint: 10000
                });
                $verticalNav.on('submenumobileopened.jquery.nav', function() {
                    self.LinkUnderliner.toUnderline($(this).find('a'));
                });
            }

        /* ------------------------------------------------
				End of Navigation
		------------------------------------------------ */

        /* ------------------------------------------------
				Custom Scrollbar
		------------------------------------------------ */

            var $customScrollbar = $('.milenia-sidebar-hidden .milenia-sidebar-hidden-content .milenia-navigation-container'),
                $customScrollbarVerticalNav = $customScrollbar.children('.milenia-navigation-vertical'),
                $customScrollbar2 = $('.milenia-sidebar-hidden--v2');
            if($customScrollbar.length && $.fn.niceScroll) {
                $customScrollbar.niceScroll({
                    scrollspeed: 60,
                    mousescrollstep: 40,
                    cursorwidth: 2,
                    cursorborder: 0,
                    rtlmode: self.RTL,
                    railalign: self.RTL ? 'left': 'right',
                    cursorborderradius: 0,
                    cursorcolor: "#1c1c1c",
                    autohidemode: false,
                    horizrailenabled: false
                });

                if($customScrollbarVerticalNav.length) {
                    $customScrollbarVerticalNav.on('navigationopening.jquery.nav submenumobileopening.jquery.nav submenumobileclosing.jquery.nav', function() {
                        $customScrollbar.getNiceScroll().resize();
                    });
                }
            }

            if($customScrollbar2.length && $.fn.niceScroll) {

                $customScrollbar2.niceScroll({
                    scrollspeed: 60,
                    mousescrollstep: 40,
                    cursorwidth: 2,
                    cursorborder: 0,
                    rtlmode: self.RTL,
                    railalign: self.RTL ? 'left': 'right',
                    cursorborderradius: 0,
                    cursorcolor: "#1c1c1c",
                    autohidemode: false,
                    horizrailenabled: false
                });
            }

            setTimeout(function() {
                $customScrollbar2.getNiceScroll().resize();
            }, self.ANIMATIONDURATION);

        /* ------------------------------------------------
				End of Custom Scrollbar
		------------------------------------------------ */

        /* ------------------------------------------------
				Countdown
		------------------------------------------------ */

			var $countdown = $('.milenia-countdown');

			if($countdown.length){
				$countdown.each(function(){
					var $this = $(this),
						endDate = $this.data(),
						until = new Date(
							endDate.year,
							endDate.month || 0,
							endDate.day || 1,
							endDate.hours || 0,
							endDate.minutes || 0,
							endDate.seconds || 0
						);

					$this.countdown({
						until : until,
						padZeroes: true,
						format : 'dHMS',
						labels : ['Years', 'Month', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds'],
						labels1 : ['Years', 'Month', 'Weeks', 'Days', 'Hours', 'Minutes', 'Seconds']
					});
				});
			}

		/* ------------------------------------------------
				End countdown
		------------------------------------------------ */

        /* ------------------------------------------------
				Instagram
		------------------------------------------------ */

            if(window.InstafeedWrapper) {
                var instafeeds = document.querySelectorAll('.milenia-instafeed > .milenia-grid'),
                    galleryInstafeeds = document.querySelectorAll('.milenia-instafeed-gallery');

                InstafeedWrapper.setUsersSecureOptions({
                    'customer': {
                        userId: 8253949243,
                        accessToken: '8253949243.1677ed0.92a1c427f7274134a812ee9b13038e10',
                        clientId: 'a17ccf850aae43a0805c00ac4792a3b9'
                    }
                });

                if(instafeeds) {
                    InstafeedWrapper.init(instafeeds, {
                        resolution: 'standard_resolution',
                        template: '<div class="milenia-grid-item"><div class="milenia-square-image" data-bg-image-src="{{image}}"><a class="milenia-ln--independent" rel="instagram" href="{{link}}" title="{{caption}}"></a></div></div>',
                        after: function(){
                            var $target = $('#' + this.options.target),
                                size = $target.data('images-y-size'),
                                posX = $target.data('images-pos-x') || 'center',
                                posY = $target.data('images-pos-y') || 'center',
                                $items = $target.find('.milenia-square-image');

                            if($items.length) {

                                $items.addClass('milenia-square-image--position-' + posX + '-' + posY);

                                if(size) $items.addClass('milenia-square-image--size-' + size);
                            }

                            self.helpers.dynamicBgImage($target.find('[data-bg-image-src]'));
                            self.helpers.updateGlobalNiceScroll();
                        }
                    });
                }

                if(galleryInstafeeds) {
                    InstafeedWrapper.init(galleryInstafeeds, {
                        resolution: 'standard_resolution',
                        template: '<div class="milenia-grid-item">\
                            <figure class="milenia-gallery-item milenia-gallery-item--with-thumb" data-bg-image-src="{{image}}">\
                                <a data-fancybox-gallery data-caption="{{caption}}" href="{{image}}" title="{{caption}}" class="milenia-gallery-item-link milenia-ln--independent">\
                                    <img src="{{image}}" alt="{{caption}}" class="milenia-d-none">\
                                </a>\
                                <figcaption class="milenia-gallery-item-caption">{{caption}}</figure>\
                            </figure>\
                        </div>\
                        ',
                        after: function() {
                            var $container = $('#' + this.options.target),
                                $fancyboxItems = $container.find('[data-fancybox-gallery]'),
                                $bgItems = $container.find('[data-bg-image-src]');

                            if($fancyboxItems.length && $.fn.fancybox) {
                                $fancyboxItems.attr('data-fancybox', this.options.target).fancybox({
                                    animationEffect: "fade"
                                });
                            }

                            if($bgItems.length) {
                                self.helpers.dynamicBgImage($bgItems);
                            }
                            self.helpers.updateGlobalNiceScroll();
                        }
                    });
                }
            };

        /* ------------------------------------------------
				End of Instagram
		------------------------------------------------ */

        /* ------------------------------------------------
				Revolution slider
		------------------------------------------------ */

            var $revSlider1 = $('#rev-slider-1'),
                $revSlider2 = $('#rev-slider-2'),
                $revSlider3 = $('#rev-slider-3'),
                $revSlider4 = $('#rev-slider-4'),
                revApi1,
                revApi2,
                revApi3;

            if($revSlider1.length && $.fn.revolution) {
                revApi1 = $revSlider1.show().revolution({
                    fullScreenOffsetContainer: ($(window).width() > 767 && $(window).height() > 600) ? '#milenia-header:not(.milenia-header--transparent-single)' : '',
                    sliderLayout: 'fullscreen',
                    dottedOverlay: 'milenia',
                    disableProgressBar: "on",
                    spinner: 'spinner3',
                    gridwidth:[1400, 1024, 813, 580],
                    responsiveLevels: [1400, 1024, 813, 580],
                    parallax: {
                        type: 'mouse+scroll',
                        origo: 'slidercenter',
                        speed: 400,
                        levels: [5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
                        disable_onmobile: 'on'
                    },
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        onHoverStop: 'false',
                        arrows: {
                            enable: false,
                        },
                        bullets: {
                            enable: true,
                            style: 'milenia',
                            hide_onleave: false,
                            h_align: 'right',
                            v_align: 'center',
                            direction: 'vertical',
                            h_offset: 60,
                            v_offset: 0,
                            space: 12,
                            hide_under: 1200
                        }
                    }
                });

                revApi1.on('revolution.slide.onchange', function() {
                    self.helpers.updateGlobalNiceScroll();
                });
            }

            if($revSlider2.length && $.fn.revolution) {
                revApi2 = $revSlider2.show().revolution({
                    fullScreenOffsetContainer: ($(window).width() > 767 && $(window).height() > 600) ? '#milenia-header:not(.milenia-header--transparent-single)' : '',
                    sliderLayout: 'fullwidth',
                    dottedOverlay: 'milenia',
                    disableProgressBar: "on",
                    spinner: 'spinner3',
                    responsiveLevels: [1400, 1024, 813, 580],
                    gridwidth:[1400, 1024, 813, 580],
                    gridheight:[800, 600, 500, 400],
                    visibilityLevels:[1400, 1024, 813, 580],
                    parallax: {
                        type: 'mouse+scroll',
                        origo: 'slidercenter',
                        speed: 400,
                        levels: [5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
                        disable_onmobile: 'on'
                    },
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        onHoverStop: 'false',
                        arrows: {
                            enable: false,
                        },
                        bullets: {
                            enable: true,
                            style: 'milenia',
                            hide_onleave: false,
                            h_align: 'right',
                            v_align: 'center',
                            direction: 'vertical',
                            h_offset: 60,
                            v_offset: 0,
                            space: 12,
                            hide_under: 1200
                        }
                    }
                });

                revApi2.on('revolution.slide.onchange', function() {
                    self.helpers.updateGlobalNiceScroll();
                });
            }

            if($revSlider3.length && $.fn.revolution) {
                revApi3 = $revSlider3.show().revolution({
                    fullScreenOffsetContainer: ($(window).width() > 767 && $(window).height() > 600) ? '#milenia-header:not(.milenia-header--transparent-single)' : '',
                    sliderLayout: 'fullwidth',
                    disableProgressBar: "on",
                    spinner: 'spinner3',
                    responsiveLevels: [1400, 1024, 813, 580],
                    gridwidth:[1400, 1024, 813, 580],
                    gridheight:[640, 600, 500, 400],
                    visibilityLevels:[1400, 1024, 813, 580],
                    parallax: {
                        type: 'mouse+scroll',
                        origo: 'slidercenter',
                        speed: 400,
                        levels: [5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
                        disable_onmobile: 'on'
                    },
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        onHoverStop: 'false',
                        arrows: {
                            enable: false,
                        },
                        bullets: {
                            enable: false
                        }
                    }
                });

                revApi3.on('revolution.slide.onchange', function() {
                    self.helpers.updateGlobalNiceScroll();
                });
            }

            if($revSlider4.length && $.fn.revolution) {
                window.roomRevApi = $revSlider4.show().revolution({
                    fullScreenOffsetContainer: ($(window).width() > 767 && $(window).height() > 600) ? '#milenia-header:not(.milenia-header--transparent-single)' : '',
                    sliderLayout: 'fullscreen',
                    disableProgressBar: "on",
                    spinner: 'spinner3',
                    gridwidth:[1400, 1024, 813, 580],
                    responsiveLevels: [1400, 1024, 813, 580],
                    navigation: {
                        keyboardNavigation: 'on',
                        keyboard_direction: 'horizontal',
                        onHoverStop: 'false',
                        arrows: {
                            enable: false,
                        },
                        bullets: {
                            enable: false
                        }
                    }
                });

                window.roomRevApi.on('revolution.slide.onchange', function() {
                    self.helpers.updateGlobalNiceScroll();
                });
            }

            if(this.helpers.revArrowsOutside) this.helpers.revArrowsOutside();

        /* ------------------------------------------------
				End of Revolution slider
		------------------------------------------------ */
        /* ------------------------------------------------
				Accordions & Toggles
		------------------------------------------------ */

            var $accordions = $('.milenia-panels--accordion'),
                $toggles = $('.milenia-panels--toggles');

            if($accordions.length) {
                $accordions.MonkeysanAccordion({
                    easing: self.ANIMATIONEASING,
					speed: self.ANIMATIONDURATION,
					cssPrefix: 'milenia-',
                    afterOpen: function() {
                        self.helpers.updateGlobalNiceScroll();
                    },
                    afterClose: function() {
                        self.helpers.updateGlobalNiceScroll();
                    }
                });
            }

            if($toggles.length) {
                $toggles.MonkeysanAccordion({
                    easing: self.ANIMATIONEASING,
					speed: self.ANIMATIONDURATION,
                    toggle: true,
					cssPrefix: 'milenia-',
                    afterOpen: function() {
                        self.helpers.updateGlobalNiceScroll();
                    },
                    afterClose: function() {
                        self.helpers.updateGlobalNiceScroll();
                    }
                });
            }

        /* ------------------------------------------------
				End of Accordions & Toggles
		------------------------------------------------ */

          /* ----------------------------------------
                  Alert Boxes
           ---------------------------------------- */

               $doc.on('pushed.milenia.alert closed.milenia.alert', function(event) {
                   self.helpers.updateGlobalNiceScroll();
               });

                var $alertBoxes = $('.milenia-alert-box');

                if($alertBoxes.filter('.milenia-alert-box--success').length) {
                    MileniaAlertBox.init($alertBoxes.filter('.milenia-alert-box--success'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'milenia-',
                        easing: self.ANIMATIONEASING,
                        type: 'success'
                    });
                }

                if($alertBoxes.filter('.milenia-alert-box--warning').length) {
                    MileniaAlertBox.init($alertBoxes.filter('.milenia-alert-box--warning'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'milenia-',
                        easing: self.ANIMATIONEASING,
                        type: 'warning'
                    });
                }

                if($alertBoxes.filter('.milenia-alert-box--info').length) {
                    MileniaAlertBox.init($alertBoxes.filter('.milenia-alert-box--info'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'milenia-',
                        easing: self.ANIMATIONEASING,
                        type: 'info'
                    });
                }

                if($alertBoxes.filter('.milenia-alert-box--error').length) {
                    MileniaAlertBox.init($alertBoxes.filter('.milenia-alert-box--error'), {
                        duration: self.ANIMATIONDURATION,
                        cssPrefix: 'milenia-',
                        easing: self.ANIMATIONEASING,
                        type: 'error'
                    });
                }

           /* ----------------------------------------
                  End of Alert Boxes
            ---------------------------------------- */

            /* ----------------------------------------
                    Tooltips
             ---------------------------------------- */

                if( $('[data-tooltip]').length && $.fn.MonkeysanTooltip ) {
                    $('[data-tooltip]').MonkeysanTooltip({
                        animationIn: 'fadeInDown',
                        animationOut: 'fadeOutUp',
                        tooltipPosition: 'top',
                        jQueryAnimationEasing: self.ANIMATIONEASING,
                        jQueryAnimationDuration: self.ANIMATIONDURATION,
                        skin: 'milenia'
                    });
                }

             /* ----------------------------------------
                    End of Tooltips
              ---------------------------------------- */

             /* ----------------------------------------
                    IsotopeWrapper
              ---------------------------------------- */

                    var $isotope = $('.milenia-grid--isotope:not(.milenia-grid--isotope-lazy)'),
                        $isotopeLazy = $('.milenia-grid--isotope.milenia-grid--isotope-lazy');

                    if($isotope.length && window.MileniaIsotopeWrapper) {
                        $isotope.each(function(index, container){
                            var $container = $(container),
                                $stretchedSection = $container.closest('.milenia-section--stretched-content, .milenia-section--stretched-content-no-px');

                            if($stretchedSection.length) {
                                $stretchedSection.on('stretched.milenia.Section', function() {
                                    if($container.data('IsotopeWrapper')) return;

                                    MileniaIsotopeWrapper.init($container, {
                                        itemSelector: '.milenia-grid-item',
                                        transitionDuration: self.ANIMATIONDURATION
                                    });
                                });
                            }
                            else {
                                MileniaIsotopeWrapper.init($container, {
                                    itemSelector: '.milenia-grid-item',
                                    transitionDuration: self.ANIMATIONDURATION
                                });
                            }
                        });
                    }

                    if($isotopeLazy.length && window.MileniaIsotopeWrapper) {
                        $isotopeLazy.each(function(index, container){
                            var $container = $(container),
                                $stretchedSection = $container.closest('.milenia-section--stretched-content, .milenia-section--stretched-content-no-px');

                            if($stretchedSection.length) {
                                $stretchedSection.on('stretched.milenia.Section', function() {
                                    if($container.data('IsotopeWrapper')) return;

                                    setTimeout(function(){
                                        MileniaIsotopeWrapper.init($container, {
                                            itemSelector: '.milenia-grid-item',
                                            transitionDuration: self.ANIMATIONDURATION
                                        });
                                    }, 500);
                                });
                            }
                            else {
                                setTimeout(function(){
                                    MileniaIsotopeWrapper.init($container, {
                                        itemSelector: '.milenia-grid-item',
                                        transitionDuration: self.ANIMATIONDURATION
                                    });
                                }, 500);
                            }
                        });
                    }

              /* ----------------------------------------
                    End of IsotopeWrapper
              ---------------------------------------- */

              /* ----------------------------------------
                    Dynamic background image
               ---------------------------------------- */

                    var $backgrounds = $('[data-bg-image-src]:not([class*="milenia-colorizer--scheme-"])');

                    if($backgrounds.length && this.helpers.dynamicBgImage) {
                        this.helpers.dynamicBgImage($backgrounds);
                    }

               /* ----------------------------------------
                    End of Dynamic background image
                ---------------------------------------- */

              /* ----------------------------------------
                    Owl Carousel
               ---------------------------------------- */

                    // owl carousel adaptive
                    if($('.owl-carousel').length) this.helpers.owlAdaptive();

                    var $simpleSlideshow = $('.milenia-simple-slideshow'),
                        $testimonialsCarousel = $('.milenia-testimonials-inner.owl-carousel');

                    if($simpleSlideshow.length && $.fn.owlCarousel) {
                        $simpleSlideshow.each(function(index, carousel){
                            var $carousel = $(carousel),
                                $stretchedSection = $carousel.closest('.milenia-section--stretched-content, .milenia-section--stretched-content-no-px');

                            if($stretchedSection.length) {
                                $stretchedSection.each(function(scindex, scelement){
                                    $(scelement).on('stretched.milenia.Section', function() {
                                        $carousel.owlCarousel(self.helpers.owlSettings({
                                            margin: 1,
                                            loop: true,
                                            autoplay: $carousel.hasClass('milenia-simple-slideshow--autoplay')
                                        }));
                                    });
                                });
                            }
                            else {

                                $carousel.owlCarousel(self.helpers.owlSettings({
                                    margin: 1,
                                    loop: true,
                                    autoplay: $carousel.hasClass('milenia-simple-slideshow--autoplay')
                                }));
                            }
                        });
                    }

                    if($testimonialsCarousel.length && $.fn.owlCarousel) {
                        $testimonialsCarousel.each(function(index, carousel) {
                            var $carousel = $(carousel),
                                $stretchedSection = $carousel.closest('.milenia-section--stretched-content, .milenia-section--stretched-content-no-px');

                            if($stretchedSection.length) {
                                $stretchedSection.on('stretched.milenia.Section', function() {
                                    if($carousel.data('owl.carousel')) return;
                                    $carousel.owlCarousel(self.helpers.owlSettings({
                                        margin: 0,
                                        loop: true,
                                        nav: false,
                                        dots: true
                                    }));
                                });
                            }
                            else {
                                $carousel.owlCarousel(self.helpers.owlSettings({
                                    margin: 0,
                                    loop: true,
                                    nav: false,
                                    dots: true
                                }));
                            }
                        });
                    }

                    this.helpers.gridOwl.extendConfigFor('.milenia-testimonials', {
                        nav: false,
                        dots: true,
                        startPosition: 1,
                        autoplay: true,
                        loop: true
                    });

                    this.helpers.gridOwl.extendConfigFor('.milenia-tabbed-carousel-thumbs', {
                        nav: true,
                        dots: false,
                        margin: 0,
                        loop: false, // !important
                        autoplay: false,
                        responsive: {
                            0: {
                                items: 1
                            },
                            480: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            },
                            1300: {
                                items: 4
                            }
                        },
                        responsiveWithSidebar: {
                            0: {
                                items: 1
                            },
                            480: {
                                items: 2
                            },
                            1350: {
                                items: 3
                            }
                        }
                    });

                    // Initialization owl carousels placed in the stretched sections
                    $('[class*="milenia-section--stretched-content"]').on('stretched.milenia.Section', function(event, $section) {
                        var $gridOwlCarousels = $section.find('.milenia-grid.owl-carousel'),
                            $simpleThumbs = $section.find('.milenia-simple-slideshow-thumbs.owl-carousel');

                        if($gridOwlCarousels.length) self.helpers.gridOwl.add($gridOwlCarousels);

                        if($simpleThumbs.length) {
                            $simpleThumbs.owlCarousel(self.helpers.owlSettings({
                                responsive: {
                                    0: {
                                        items: 2
                                    },
                                    380: {
                                        items: 3
                                    },
                                    992: {
                                        items: 4
                                    },
                                    1200: {
                                        items: 6
                                    }
                                },
                                margin: 10,
                                loop: false
                            }));
                        }
                    });

                    // Initialization owl carousels placed in the normal sections
                    var $simpleThumbs = $('.milenia-simple-slideshow-thumbs.owl-carousel').filter(function(index, element){
                        return !$(element).closest('[class*="milenia-section--stretched-content"]').length;
                    });

                    if($simpleThumbs.length) {
                        $simpleThumbs.owlCarousel(self.helpers.owlSettings({
                            responsive: {
                                0: {
                                    items: 2
                                },
                                380: {
                                    items: 3
                                },
                                992: {
                                    items: 4
                                },
                                1200: {
                                    items: 6
                                }
                            },
                            margin: 10,
                            loop: false
                        }));
                    }

                    this.helpers.gridOwl.add($('.milenia-grid.owl-carousel').filter(function(index, element){
                        return !$(element).closest('[class*="milenia-section--stretched-content"]').length;
                    }));

                    this.helpers.owlSyncTabbed.init($("[data-tabbed-sync]"));
                    this.helpers.owlSync.init();


               /* ----------------------------------------
                    End of Owl Carousel
                ---------------------------------------- */

               /* ----------------------------------------
                    Rating
                ---------------------------------------- */

                    var $ratingFields = $('.milenia-rating-field'),
                        $ratings;

                    if($ratingFields.length) {
                        $ratings = $ratingFields.find('.milenia-rating');

                        if($ratings.length) {
                            $ratings.on('built.milenia.Rating', function(event, $rating) {
                                var $tabs = $rating.closest('.milenia-tabs'),
                                    Tabs;

                                if($tabs.length) {
                                    Tabs = $tabs.data('tabs');

                                    if(Tabs) Tabs.updateContainer();
                                }
                            });
                        }
                    }


                    if(this.helpers.rating) this.helpers.rating($('.milenia-rating:not(.milenia-rating--independent)'), {
                        topLevelElements: null,
                        bottomLevelElements: '<i class="icon icon-star"></i>'
                    });

                    if(this.helpers.rating) this.helpers.rating($('.milenia-rating--independent'), {
                        topLevelElements: '<i class="icon icon-star"></i>',
                        bottomLevelElements: '<i class="icon icon-star"></i>'
                    });

                    if(this.helpers.ratingField) this.helpers.ratingField($('.milenia-rating-field'));

               /* ----------------------------------------
                    End of Rating
                ---------------------------------------- */

               /* ----------------------------------------
                    Tabbed Grid
                ---------------------------------------- */

                    if(window.MileniaTabbedGrid) {
                        window.MileniaTabbedGrid.init($('.milenia-grid--tabbed'), {
                            cssPrefix: 'milenia-',
                            easing: self.ANIMATIONEASING,
                            duration: self.ANIMATIONDURATION
                        });

                        $('[class*="milenia-section--stretched-content"]').on('stretched.milenia.Section', function(event, $section) {
                            var $gridTabbed = $section.find('.milenia-grid--tabbed');

                            setTimeout(function(){
                                if($gridTabbed.length) $gridTabbed.data('TabbedGrid').resize();
                            }, self.ANIMATIONDURATION);
                        });

                        $('.milenia-grid--tabbed').on('grid.resized.tabbedgrid item.shown.tabbedgrid', function(event, $grid) {
                            if($grid.data('TabsResizeTimeOutId')) clearTimeout($grid.data('TabsResizeTimeOutId'));
                            self.helpers.updateGlobalNiceScroll();

                            $grid.data('TabsResizeTimeOutId', setTimeout(function(){
                                var $tabs = $grid.closest('.milenia-tabs'),
                                    Tabs;
                                if(!$tabs.length) return;

                                Tabs = $tabs.data('tabs');

                                if(Tabs) Tabs.updateContainer();
                            }, 100));
                        });
                    }

               /* ----------------------------------------
                    End of Tabbed Grid
                ---------------------------------------- */

               /* ----------------------------------------
                    Google Maps
                ---------------------------------------- */

                    if($('.milenia-gmap').length) this.modules.GoogleMaps.init();

               /* ----------------------------------------
                    End of Google Maps
                ---------------------------------------- */

                if(this.helpers.touchHoverEmulator) this.helpers.touchHoverEmulator($('.milenia-entities--style-17'), '.milenia-entity-link', '.milenia-entity');

        /* ----------------------------------------
               Self Hosted Video
         ---------------------------------------- */

           var $selfHostedVideos = $('.milenia-selfhosted-video');

           if($selfHostedVideos.length) {
               $selfHostedVideos.on('click.MileniaSelfHostedVideo', function(event) {
                   var $this = $(this),
                       $state = $this.find('.mejs__overlay-play');

                   if($state.length) {
                       setTimeout(function() {
                           $this[!$state.is(':visible') ? 'addClass' : 'removeClass']('milenia-selfhosted-video--playing');
                       },0);
                   }
               });
           }

        /* ----------------------------------------
               End of Self Hosted Video
         ---------------------------------------- */

         $body.on('spaceadded.milenia.stickysection spaceremoved.milenia.stickysection', function(){
             self.helpers.updateGlobalNiceScroll();
         });

         $doc.on('container.updated.mokeysan.tabs', function(event, $container) {
             self.helpers.updateGlobalNiceScroll();
         });

         DOMDfd.resolve();
    };

    App.afterOuterResourcesLoaded = function() {

        var self = this;

        // Stop initializing any modules in case legacy browser is using
        if(this.ISLEGACYBROWSER) return;

        setTimeout(function(){ if(self.LinkUnderliner) self.LinkUnderliner.init($('a, .milenia-btn--link')); }, 100);

        var $sections = $('.milenia-section');

        if(this.helpers.Colorizer) this.helpers.Colorizer.init($('[class*="milenia-colorizer--scheme-"]'));

        if(this.modules.Section && $sections.length) {
            this.modules.Section.init($sections);
        }

        if(this.helpers.Breadcrumb) this.helpers.Breadcrumb.init($('.milenia-header--transparent + .milenia-breadcrumb[data-bg-image-src]'));

        /* ----------------------------------------
            SameHeight
        ---------------------------------------- */

            if($.fn.MonkeysanSameHeight) {

                var $sameheightContainers = $('.milenia-entities--style-6 .milenia-grid:not([data-isotope-layout="masonry"]):not(.milenia-grid--cols-1), .milenia-entities--style-7 .milenia-grid:not([data-isotope-layout="masonry"]):not(.milenia-grid--cols-1), .milenia-entities--style-8 .milenia-grid:not([data-isotope-layout="masonry"]):not(.milenia-grid--cols-1)').not('.milenia-shortcode-container'),
                    $pricingTables = $('.milenia-flexbox .milenia-pricing-tables');

                if( $sameheightContainers.length ) {

                    $sameheightContainers.each(function(index, container){
                        var $container = $(container),
                            $items = $container.find('.milenia-grid-item');

                        if($items.length) {
                            $container.MonkeysanSameHeight({
                                target: $container.closest('.milenia-entities--style-7').length ? '.milenia-entity' : '.milenia-entity-content .milenia-aligner-inner',
                                isIsotope: $container.find('.milenia-grid--isotope').length,
                                columns: $items.length ? Math.floor( $container.outerWidth() / $items.first().outerWidth() ) : null
                            });
                        }
                    });
                }

                if( $pricingTables.length ) {

                    $pricingTables.each(function(index, container){
                        var $container = $(container),
                            $items = $container.find('.milenia-grid-item');

                        if($items.length) {
                            $container.MonkeysanSameHeight({
                                target: '.milenia-pricing-table',
                                isIsotope: $container.find('.milenia-grid--isotope').length,
                                columns: $items.length ? Math.ceil( $container.outerWidth() / $items.first().outerWidth() ) : null
                            });
                        }
                    });
                }
            }

        /* ----------------------------------------
            End of SameHeight
        ---------------------------------------- */

        if(this.helpers.fullScreenArea) this.helpers.fullScreenArea.init({
            except: $('#milenia-header:not(.milenia-header--transparent)').add($('#milenia-footer'))
        });

        /* ----------------------------------------
                Tabs & Tour Sections
         ---------------------------------------- */

            var $tabs = $('.milenia-tabs');

            if($tabs.length) {
                $tabs.MonkeysanTabs({
					speed: self.ANIMATIONDURATION,
                    easing: self.ANIMATIONEASING,
					cssPrefix: 'milenia-',
                    afterOpen: function() {
                        self.helpers.updateGlobalNiceScroll();
                    },
                    afterClose: function() {
                        self.helpers.updateGlobalNiceScroll();
                    }
				});
            }

         /* ----------------------------------------
                End of Tabs & Tour Sections
          ---------------------------------------- */

          if(this.modules.preloader) this.modules.preloader();

          var $parallaxSections = $('.milenia-colorizer--parallax .milenia-colorizer-bg-image');

          if($parallaxSections.length) {
              $parallaxSections.parallax("50%",.4);
          }
    };

    App.LinkUnderliner = {
        _$collection: $(),
		init: function($collection) {
			var self = this,
				$currentFilteredCollection;

			if(!$.isjQuery($collection) || !$collection.length) return;

			if(!this._bindedEvents) this._bindEvents();

			$currentFilteredCollection = $();

			$collection.each(function(index, element){
				var $element = $(element);

				if(self._$collection.filter($element).length) return;

				self._$collection = self._$collection.add($element);
				$currentFilteredCollection = $currentFilteredCollection.add($element);
			});

			return this.toUnderline($currentFilteredCollection);
		},
		isRTL: function() {
			return getComputedStyle(document.body).direction === 'rtl';
		},
		_bindEvents: function() {
			var self = this;

			$(window).on('resize.MileniaLinksUnderline', function() {
				if(self.resizeTimeOutId) clearTimeout(self.resizeTimeOutId);

				self.resizeTimeOutId = setTimeout(function(){
					self.toUnderline(self._$collection);
				}, 100);
			});
		},
		toUnderline: function($collection) {
			var self = this;

			if(!$.isjQuery($collection) || !$collection.length) return;

			return $collection.each(function(index, element){
				var $element = $(element),
					transitionDuration = getComputedStyle($element.get(0)).transitionDuration,
					transitionDurationMS = parseFloat(transitionDuration, 10) * 1000;

				if(transitionDurationMS) {
					setTimeout(function(){
						self.setUnderlineToElement($element);
					}, transitionDurationMS);
				}
				else {
					self.setUnderlineToElement($element);
				}
			});
		},
		setUnderlineToElement: function($element) {
			var backgroundPosition = $element.css('background-position').split(' '),
				resultLineHeight;

			$element.css('white-space', 'nowrap');
			resultLineHeight = $element.outerHeight() - 1;
			$element.css('white-space', '');

			if(this.isRTL() && backgroundPosition[0]) backgroundPosition[0] = '100%';

			if(backgroundPosition[1]) backgroundPosition[1] = resultLineHeight + 'px';

			$element.css('background-position', backgroundPosition.join(' '));
		}
    };

    /* ----------------------------------------
            Back to top
     ---------------------------------------- */

        App.modules.backToTop = function(config) {

             var backToTop = {

                 init: function(config){

                     var self = this;

                     if(config) this.config = $.extend(this.config, config);

                     this.btn = $('<button></button>', {
                         class: self.config.cssPrefix+'back-to-top animated stealthy',
                         html: '<span class="icon icon-chevron-up"></span>'
                     });

                     this.bindEvents();

                     $body.append(this.btn);

                 },

                 config: {
                     breakpoint: 700,
                     showClass: 'zoomIn',
                     hideClass: 'zoomOut',
                     easing: 'linear',
                     speed: 500,
                     cssPrefix: ''
                 },

                 bindEvents: function(){

                     var page = $('html, body'),
                         self = this;

                     this.btn.on('click', function(e){

                         $body.getNiceScroll().stop();

                         page.stop().animate({

                             scrollTop: 0

                         }, {
                             easing: self.config.easing,
                             duration: self.config.speed
                         });

                     });

                     this.btn.on(App.ANIMATIONEND, function(e){

                         e.preventDefault();

                         var $this = $(this);

                         if($this.hasClass(self.config.hideClass)){

                             $this
                                 .addClass('stealthy')
                                 .removeClass(self.config.hideClass + " " + self.config.cssPrefix + "inview");

                         }

                     });

                     $(window).on('scroll.backtotop', { self: this}, this.toggleBtn);

                 },

                 toggleBtn: function(e){

                     var $this = $(this),
                         self = e.data.self;

                     if($this.scrollTop() > self.config.breakpoint && !self.btn.hasClass(self.config.cssPrefix + 'inview')){

                         self.btn
                                 .addClass(self.config.cssPrefix + 'inview')
                                 .removeClass('stealthy');

                         if(App.ANIMATIONSUPPORTED){
                             self.btn.addClass(self.config.showClass);
                         }

                     }
                     else if($this.scrollTop() < self.config.breakpoint && self.btn.hasClass(self.config.cssPrefix + 'inview')){

                         self.btn.removeClass(self.config.cssPrefix + 'inview');

                         if(!App.ANIMATIONSUPPORTED){
                             self.btn.addClass('stealthy');
                         }
                         else{
                             self.btn.removeClass(self.config.showClass)
                                     .addClass(self.config.hideClass);
                         }

                     }

                 }

             };

             backToTop.init(config);

             return this;

         };

    /* ----------------------------------------
            End of Back to top
     ---------------------------------------- */

    /* ----------------------------------------
            Preloader
     ---------------------------------------- */

        App.modules.preloader = function() {
            var $preloader = $('.milenia-preloader'),
                leftPos = parseInt($preloader.css('margin-left'), 10),
                topPos = parseInt($preloader.css('margin-top'), 10),
                $w = $(window),
                $nav = $('.milenia-navigation, .milenia-navigation-vertical');

            if($nav.length) {
                $nav.off('click.MileniaPreloader').on('click.MileniaPreloader', 'a', function(event){

                    var $this = $(this),
                        $circle = $('<div></div>', {
                            style: 'left: '+ event.clientX +'px; top: '+ event.clientY +'px;',
                            class: 'milenia-preloader-circle'
                        });

                    if($body.hasClass('milenia-body--moving-to-another-page')) {
                        $circle.appendTo($body);

                        setTimeout(function(){
                            $circle.addClass('milenia-preloader-circle--appearing');
                        }, 20);
                    }
                });
            }

            if(!$preloader.length) return;

            $body.off('mousemove.MileniaPreloader').on('mousemove.MileniaPreloader', function(event) {
                $preloader.css({
                    'margin-left': leftPos - ($w.width() / 2 - event.pageX),
                    'margin-top': topPos - ($w.height() / 2 - (event.pageY - $w.scrollTop())),
                });
            }).jQueryImagesLoaded().then(function(){
                var $niceScrollRails = $('.nicescroll-rails');

                $preloader.addClass('milenia-preloader--disappearing');
                setTimeout(function() {
                    $preloader.remove();
                    $body.off('mousemove.MileniaPreloader');
                    App.helpers.updateGlobalNiceScroll();
                    if($niceScrollRails.length) $niceScrollRails.css('visibility', 'visible');
                }, 700);
                // can be removed in production (demo only):
                if(window.location.hash == '#milenia-footer') {
                    $('html, body').stop().animate({
                        scrollTop: $doc.height()
                    }, {
                        duration: self.ANIMATIONDURATION,
                        easing: self.ANIMATIONEASING
                    });
                }
            });
        };

    /* ----------------------------------------
            End of Preloader
     ---------------------------------------- */

    /* ----------------------------------------
            Field Counter
     ---------------------------------------- */

        App.modules.fieldCounter = function() {
            $body.on('click.MileniaFieldCounter', '.milenia-field-counter-control', function(e) {
                var $this = $(this),
                    $field = $this.siblings('.milenia-field-counter-target'),
                    $value = $this.siblings('.milenia-field-counter-value'),
                    val = +$field.val();

                if($this.hasClass('milenia-field-counter-control--decrease') && val != 0) {
                    val--;
                }
                else if($this.hasClass('milenia-field-counter-control--increase')) {
                    val++;
                }

                $field.val(val);
                $value.text(val);

                e.preventDefault();
            });
        };

    /* ----------------------------------------
            End of Field Counter
     ---------------------------------------- */

    /* ----------------------------------------
            WPGallery
     ---------------------------------------- */

        App.modules.WPGallery = {};
        App.modules.WPGallery._cache = [];

        App.modules.WPGallery.init = function($collection) {
            var self = this;

            if(!$.isjQuery($collection, true)) return $collection;

            return $collection.each(function(index, gallery){
                var $gallery = $(gallery);

                if(self.isInitialized($gallery)) return;

                self.initializeSingle($gallery);
            });
        };

        App.modules.WPGallery.isInitialized = function($gallery) {
            return !$.isjQuery($gallery, true) || $gallery.data('milenia-wp-gallery-initialized');
        };

        App.modules.WPGallery.initializeSingle = function($gallery) {
            var $items,
                id;

            if(!$.isjQuery($gallery, true)) return $gallery;

            $items = $gallery.find('a[href$=".jpg"], a[href$=".png"], a[href$=".jpeg"], a[href$=".gif"]');

            if($items.length) {
                id = App.helpers.getRandomId('gallery');

                $items.data('fancybox', id).attr('data-fancybox', id);

                $gallery.data('milenia-wp-gallery-initialized', true);
            }

            return $gallery;
        };

    /* ----------------------------------------
            End of WPGallery
     ---------------------------------------- */


    /* ----------------------------------------
            Field Datepicker
     ---------------------------------------- */

        App.modules.fieldDatepicker = function() {
            $body.on('change.MileniaFieldDatepicker', 'input.milenia-field-datepicker-invoker', function(event) {
                var $field = $(this),
                    $markupField = $field.siblings('.milenia-field-datepicker'),
                    $day,
                    $yearAndMonth,
                    $dayName,
                    currentDate = moment($field.datepicker("getDate"));

                if($markupField.length && $markupField.hasClass('milenia-field-datepicker--style-1')) {
                    $day = $markupField.find('.milenia-field-datepicker-day');
                    $yearAndMonth = $markupField.find('.milenia-field-datepicker-month-year');
                    $dayName = $markupField.find('.milenia-field-datepicker-dayname');

                    if($day.length) {
                        $day.text(currentDate.date());
                    }

                    if($yearAndMonth.length) {
                        $yearAndMonth.text(currentDate.format('MMMM, YYYY'));
                    }

                    if($dayName.length) {
                        $dayName.text(currentDate.format('dddd'));
                    }
                }
                else if($markupField.length && ($markupField.hasClass('milenia-field-datepicker--style-2') || $markupField.hasClass('milenia-field-datepicker--style-3') || $markupField.hasClass('milenia-field-datepicker--style-4'))) {
                    $markupField.text(currentDate.format('dddd Do MMMM, YYYY'));
                }
            });
        };

    /* ----------------------------------------
            End of Field Datepicker
     ---------------------------------------- */

    /* ----------------------------------------
            Hidden Filters
     ---------------------------------------- */

        App.modules.hiddenFilters = function() {
            $body.on('click.MileniaHiddenFilters', '.milenia-hidden-filters-show', function(e) {
                var $this = $(this),
                    $shownElement = $this.closest('.milenia-hidden-filters-shown'),
                    $hiddenElement,
                    $hiddenElementActionButton;

                if($shownElement.length) {
                    $hiddenElement = $shownElement.siblings('.milenia-hidden-filters-hidden');

                    $shownElement.removeClass('milenia-hidden-filters--visible').attr('aria-hidden', 'true');
                    $this.attr('aria-expanded', 'false');

                    if($hiddenElement.length) {
                        $hiddenElement.addClass('milenia-hidden-filters--visible').attr('aria-hidden', 'false');

                        $hiddenElementActionButton = $hiddenElement.find('.milenia-hidden-filters-hide');

                        if($hiddenElementActionButton.length) $hiddenElementActionButton.attr('aria-expanded', 'true');
                    }
                }
                e.preventDefault();
            }).on('click.MileniaHiddenFilters', '.milenia-hidden-filters-hide', function(e) {
                var $this = $(this),
                    $hiddenElement = $this.closest('.milenia-hidden-filters-hidden'),
                    $shownElement,
                    $shownElementActionButton;

                if($hiddenElement.length) {
                    $shownElement = $hiddenElement.siblings('.milenia-hidden-filters-shown');

                    $hiddenElement.removeClass('milenia-hidden-filters--visible').attr('aria-hidden', 'true');
                    $this.attr('aria-expanded', 'false');

                    if($shownElement.length) {
                        $shownElement.addClass('milenia-hidden-filters--visible').attr('aria-hidden', 'false');

                        $shownElementActionButton = $shownElement.find('.milenia-hidden-filters-show');

                        if($shownElementActionButton.length) $shownElementActionButton.attr('aria-expanded', 'true');
                    }
                }

                e.preventDefault();
            });
        };

    /* ----------------------------------------
            End of Hidden Filters
     ---------------------------------------- */

    /* ----------------------------------------
            Fancybox Album
     ---------------------------------------- */

        App.modules.fancyboxAlbum = {};

        App.modules.fancyboxAlbum.init = function() {
            $body.off('click.MileniaFancyboxAlbum').on('click.MileniaFancyboxAlbum', '[data-fancybox-album-src]', function(event) {
                var $this = $(this),
                    srcs;

                if($.fn.fancybox) {
                    srcs = $this.data('fancybox-album-src');
                    if(srcs) $.fancybox.open(srcs);
                }

                event.preventDefault();
            });
        };

    /* ----------------------------------------
            End of Fancybox Album
     ---------------------------------------- */

    /* ----------------------------------------
            Dropdown
     ---------------------------------------- */

        App.modules.dropdown = {};

        App.modules.dropdown.config = {
            uncloseable: '.milenia-dropdown, .select2-container--milenia',
            cssPrefix: 'milenia-',
            availableError: 30,
            rtl: App.RTL,
            classMap: {
                active: 'dropdown--opened',
                container: 'dropdown',
                title: 'dropdown-title',
                element: 'dropdown-element',
                leftPlaced: 'dropdown-element--x-left',
                rightPlaced: 'dropdown-element--x-right',
                topPlaced: 'dropdown-element--y-top'
            }
        };

        App.modules.dropdown.init = function(config) {
            if(this._initialized) return;

            if($.isPlainObject(config)) $.extend(true, this.config, config);

            Object.defineProperties(this, {
                activeClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.active;
                    }
                },
                containerClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.container;
                    }
                },
                titleClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.title;
                    }
                },
                elementClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.element;
                    }
                },
                rightPlacedClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.rightPlaced;
                    }
                },
                leftPlacedClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.leftPlaced;
                    }
                },
                topPlacedClass: {
                    get: function() {
                        return this.config.cssPrefix + this.config.classMap.topPlaced;
                    }
                },
                $dropdowns: {
                    get: function() {
                        return $('.' + this.containerClass);
                    }
                }
            });

            this._bindEvents();
        };

        App.modules.dropdown._bindEvents = function() {
            var self = this;

            $doc.off('click.MileniaDropdown').on('click.MileniaDropdown', function(e) {
                var $target = $(e.target);

                if(!$target.closest(self.config.uncloseable).length) {
                    self.close(self.$dropdowns);
                }
            }).on('keydown.MileniaDropdown', function(event) {
                if(event.keyCode && event.keyCode == 27) {
                    self.close(self.$dropdowns);
                }
            });

            $body.off('click.MileniaDropdown').on('click.MileniaDropdown', '.' + self.titleClass, function(e) {
                var $dropdown = $(this).closest('.' + self.containerClass),
                    $others = self.$dropdowns.not($dropdown);

                if($dropdown.length) {
                    self.toggle($dropdown);
                    e.preventDefault();
                }

                self.close($others);
            });

            this._initialized = true;
        };

        App.modules.dropdown.close = function($dropdowns) {
            if(!$.isjQuery($dropdowns, true)) return;

            $dropdowns.removeClass(this.activeClass)
                      .find('.' + this.elementClass)
                      .attr('aria-hidden', 'true')
                      .end()
                      .find('.' + this.titleClass)
                      .attr('aria-expanded', 'false');
        };

        App.modules.dropdown.open = function($dropdowns) {
            if(!$.isjQuery($dropdowns, true)) return;

            this.fixPosition($dropdowns);

            $dropdowns.addClass(this.activeClass)
                      .find('.' + this.elementClass)
                      .attr('aria-hidden', 'false')
                      .end()
                      .find('.' + this.titleClass)
                      .attr('aria-expanded', 'true');
        };

        App.modules.dropdown.fixPosition = function($dropdowns) {
            var self = this,
                $w = $(window);

            if(!$.isjQuery($dropdowns, true)) return;

            return $dropdowns.each(function(index, dropdown) {
                var $dropdown = $(dropdown),
                    $element = $dropdown.find('.' + self.elementClass),
                    dOffset;

                $element.removeClass(self.leftPlacedClass)
                        .removeClass(self.rightPlacedClass)
                        .removeClass(self.topPlacedClass);

                dOffset = $element.offset();

                // x
                if(dOffset.left - self.config.availableError < 0) {
                    $element.addClass(self.leftPlacedClass);
                }
                else if(dOffset.left + $element.outerWidth() + self.config.availableError > $w.width()) {
                    $element.addClass(self.rightPlacedClass);
                }

                // y
                if(dOffset.top + $element.outerHeight() + self.config.availableError > $w.scrollTop() + $w.height()) {
                    $element.addClass(self.topPlacedClass);
                }
            });
        };

        App.modules.dropdown.toggle = function($dropdowns) {
            if(!$.isjQuery($dropdowns, true)) return;
            var self = this;

            return $dropdowns.each(function(index, dropdown){
                var $dropdown = $(dropdown);

                if($dropdown.hasClass(self.activeClass)) self.close($dropdown);
                else self.open($dropdown);
            });
        };

    /* ----------------------------------------
            End of Dropdown
     ---------------------------------------- */
    /* ----------------------------------------
            Arctic Modal
     ---------------------------------------- */

        App.modules.arcticModals = {
             _config: {
                 type: 'html',
                 closeOnOverlayClick: true,
                 overlay: {
                     css: {
                         opacity: .8,
                         backgroundColor: '#000000'
                     }
                 },
                 clickableElements: null
             },
             _collection: $(),
             init: function( collection, config ) {

                 if( !collection || !collection.length ) return;

                 config = $.isPlainObject( config ) ? $.extend(true, {}, this._config, config) : this._config;

                 config = this._prepareCallbacks( config );

                 if( config && config.clickableElements ) {
                     $body.on('click.MileniaArcticModals', '.arcticmodal-container', function(e){
                         var $target = $(e.target);
                         if( !$target.closest( config.clickableElements ).length ) {
                             $.arcticmodal('close');
                         }
                     });
                 }

                 collection.on('click.MileniaArcticModals', function(e) {

                     var $this = $(this);

                     if( $this.data('arctic-modal-type') == 'ajax' ) {
                         if(!$this.data('arctic-modal-ajax-action')) {
                             return;
                         }

                         $.arcticmodal($.extend(true, {}, config, {
                             type: 'ajax',
                             url: MileniaAJAXData.url,
                             ajax: {
                                 cache: false,
                                 dataType: 'html',
                                 data: {
                                     action: $this.data('arctic-modal-ajax-action'),
                                     data: $this.data('arctic-modal-ajax-data'),
                                     AJAX_token: MileniaAJAXData.AJAX_token
                                 },
                                 success: function(data, el, response) {
                                     data.body.html( response );
                                 }
                             }
                         }));
                     }
                     else {
                         $($this.data('arctic-modal')).arcticmodal(config);
                     }

                     e.preventDefault();
                 });
             },
             _prepareCallbacks: function(config) {
                var beforeOpenCallback = config.beforeOpen || function(){},
                	beforeCloseCallback = config.beforeClose || function(){},
                	afterOpenCallback = config.afterOpen || function(){},
                	afterCloseCallback = config.afterClose || function(){};

                config.beforeOpen = function() {

                	beforeOpenCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                config.afterOpen = function () {
                	if(App.LinkUnderliner) {
                        App.LinkUnderliner.init(this.body.find('a'));
                	}
                	afterOpenCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                config.beforeClose = function(event) {

                	beforeCloseCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                config.afterClose = function(event) {
                    $body.css('overflow', '');

                	afterCloseCallback.apply(this, Array.prototype.slice(arguments, 0));
                };

                return config;

			}
        };

    /* ----------------------------------------
            End of Arctic Modal
     ---------------------------------------- */

    /* ----------------------------------------
        Alert Message Module
    ---------------------------------------- */

        App.modules.alertMessage = function(options) {
            if(!('Handlebars' in window)) return;
            var config = {
                target: $body.children().last(),
                type: 'info',
                timeout: 4000
            };
            config = options && $.isPlainObject(options) ? $.extend(true, {}, config, options) : config;

            var template =
                '<div class="milenia-alert-box milenia-alert-box--{{type}}" style="display: none;">\
                    <div class="milenia-alert-box-inner">\
                        {{message}}\
                    </div>\
                </div>';

            var messageBox = $(Handlebars.compile(template)(config));
            messageBox.data('timeOut', setTimeout(function(){
                messageBox.stop().slideUp({
                    duration: 350,
                    easing: 'linear',
                    complete: function() {
                        $(this).remove();
                        App.helpers.updateGlobalNiceScroll();
                    },
                    step: function() {
                        var $this = $(this),
                            $niceScrolled = $this.closest('.milenia--nice-scrolled');

                        if($niceScrolled.length) {
                            $niceScrolled.getNiceScroll().resize();
                        }
                        App.helpers.updateGlobalNiceScroll();

                    }
                });
            }, config.timeout)).insertAfter(config.target).stop().slideDown({
                duration: 350,
                easing: 'linear',
                step: function() {
                    var $this = $(this),
                        $niceScrolled = $this.closest('.milenia--nice-scrolled');

                    if($niceScrolled.length) {
                        $niceScrolled.getNiceScroll().resize();
                    }
                    App.helpers.updateGlobalNiceScroll();

                },
                completer: function() {
                    App.helpers.updateGlobalNiceScroll();
                }
            });
        };

    /* ----------------------------------------
        End of Alert Message Module
    ---------------------------------------- */


    /* ----------------------------------------
            Section Module
     ---------------------------------------- */

        App.modules.Section = {};
        App.modules.Section._$collection = $();
        App.modules.Section.config = {
            cssPrefix: 'milenia-',
            resizeDelay: 10,
            boddyPaddings: false,
            classMap: {
                loading: 'section--loading',
                stretched: 'section--stretched',
                stretchedContent: 'section--stretched-content',
                stretchedContentNoPadding: 'section--stretched-content-no-px',
                bgColorElementClass: 'colorizer-bg-color',
                bgImageElementClass: 'colorizer-bg-image'
            }
        };

        Object.defineProperties(App.modules.Section, {
            bgColorElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgColorElementClass;
                }
            },
            bgImageElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgImageElementClass;
                }
            },
            stretchedClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.stretched;
                }
            },
            stretchedContentClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.stretchedContent;
                }
            },
            stretchedContentNoPaddingClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.stretchedContentNoPadding;
                }
            },
            loadingClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.loading;
                }
            }
        });

        App.modules.Section.changeConfig = function(config) {
            return $.extend(true, this.config, config);
        };

        App.modules.Section.init = function($collection) {
            var self = this;

            if(!$.isjQuery($collection, true)) return;

            if(!this._bindedGlobalEvents) this._bindGlobalEvents();

            return $collection.each(function(index, section){
                var $section = $(section);

                if(self._$collection.filter($section).length) return;

                self.build($section);
                self._$collection = self._$collection.add($section);
            });
        };

        App.modules.Section._bindGlobalEvents = function () {
            var self = this;

            $(window).on('resize.App.modules.Section', function() {
                if(self._resizeTimeOutId) clearTimeout(self._resizeTimeOutId);

                self._resizeTimeOutId = setTimeout(function(){
                    self.rebuild();
                }, self.config.resizeDelay);
            });
        };

        App.modules.Section.rebuild = function() {
            var self = this;

            return this._$collection.each(function(index, section){
                var $section = $(section);

                self.reset($section).build($section);
            });
        };

        App.modules.Section.reset = function($section) {
            if(!$.isjQuery($section, true)) return;

            $section.css({
                'margin-left': '',
                'margin-right': ''
            });

            return this;
        };

        App.modules.Section.build = function($section) {
            if(!$.isjQuery($section, true)) return;

            if($section.hasClass(this.stretchedClass)) {
                this.stretch($section);
            }
            else if($section.hasClass(this.stretchedContentClass) || $section.hasClass(this.stretchedContentNoPaddingClass)) {
                this.stretchContent($section);
            }

            return this;
        };

        App.modules.Section.getDocumentGeometry = function() {
            return {
                'padding-left': parseInt($body.css('padding-left'), 10),
                'padding-right': parseInt($body.css('padding-right'), 10)
            };
        };

        App.modules.Section.stretch = function($section) {
            var $bgs, xOffsetDiff, documentGeometry;

            if(!$.isjQuery($section, true)) return;

            $bgs = $section.find('.' + this.bgColorElementClass + ', .' + this.bgImageElementClass);

            if(!$bgs.length) return;

            xOffsetDiff = $section.offset().left;
            documentGeometry = this.getDocumentGeometry();

            if(xOffsetDiff > 0) {
                $bgs.css({
                    left: (xOffsetDiff - documentGeometry['padding-left']) / -1,
                    right: (xOffsetDiff - documentGeometry['padding-right']) / -1
                });
            }

            $section.removeClass(this.loadingClass).trigger('stretched.milenia.Section', [$section]);

            return $section;
        };

        App.modules.Section.stretchContent = function($section) {
            var xOffsetDiff, documentGeometry;

            if(!$.isjQuery($section) || !$section.length) return;

            xOffsetDiff = $section.offset().left;
            documentGeometry = this.getDocumentGeometry();

            if(xOffsetDiff > 0) {
                $section.css({
                    'margin-left': (xOffsetDiff - documentGeometry['padding-left']) / -1,
                    'margin-right': (xOffsetDiff - documentGeometry['padding-right']) / -1
                });
            }

            $section.removeClass(this.loadingClass).trigger('stretched.milenia.Section', [$section]);

            return $section;
        };

     /* ----------------------------------------
            End of Section Module
      ---------------------------------------- */

     /* ----------------------------------------
            Nice Scroll updater
      ---------------------------------------- */

        App.helpers.updateGlobalNiceScroll = function() {
            $body.getNiceScroll().resize();
        };

     /* ----------------------------------------
            End of Nice Scroll updater
      ---------------------------------------- */

     /* ----------------------------------------
            ID Randomizer
      ---------------------------------------- */

        App.helpers.getRandomId = function(idPart) {
            if(!('ids' in App._localCache)) App._localCache['ids'] = [];
            idPart = idPart || 'identifier';

            var id = idPart + '-' + +(new Date());

            if(App._localCache['ids'].indexOf(id) != -1) {
                id = App.helpers.getRandomId(idPart);
            }

            App._localCache['ids'].push(id);

            return id;
        };

     /* ----------------------------------------
            End of ID Randomizer
      ---------------------------------------- */


     /* ----------------------------------------
            Colorizer
      ---------------------------------------- */

        App.helpers.Colorizer = {};
        App.helpers.Colorizer.config = {
            cssPrefix: 'milenia-',
            classMap: {
                bgColorElement: 'colorizer-bg-color',
                bgImageElement: 'colorizer-bg-image',
                parallax: 'colorizer--parallax'
            },
            afterInit: function() {}
        };

        Object.defineProperties(App.helpers.Colorizer, {
            bgColorElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgColorElement;
                }
            },
            bgImageElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgImageElement;
                }
            },
            parallaxClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.parallax;
                }
            }
        });

        /**
         *
         * @param {jQuery} $collection - collection of elements to colorize
         * @returns {jQuery} $collection
         */
        App.helpers.Colorizer.init = function($collection, config) {
            var self = this;

            if(!$.isjQuery($collection, true)) return $collection;

            this.config = $.extend(true, {}, this.config, config);

            $collection.each(function(index, element) {
                var $element = $(element);

                if(!self.hasBGColorElement($element)) {
                    self.appendBGColorElement($element);
                }

                if(!self.hasBGImageElement($element) && $element.data('bg-image-src')) {
                    self.appendBGImageElement($element);
                }
            });

            this.config.afterInit.call(this);

            return $collection;
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {Boolean}
         */
        App.helpers.Colorizer.hasBGColorElement = function($element) {
            return $element.children('.' + this.bgColorElementClass).length;
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {Boolean}
         */
        App.helpers.Colorizer.hasBGImageElement = function($element) {
            return $element.children('.' + this.bgImageElementClass).length;
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {jQuery}
         */
        App.helpers.Colorizer.appendBGColorElement = function($element) {
            var self = this,
                $bgColorElement = $('<div></div>', {
                    class: self.bgColorElementClass
                });

            return $element.prepend($bgColorElement);
        };

        /**
         *
         * @param {jQuery} $element
         * @returns {jQuery}
         */
        App.helpers.Colorizer.appendBGImageElement = function($element) {
            var self = this,
                src = $element.data('bg-image-src'),
                $bgImageElement = $('<div></div>', {
                    class: self.bgImageElementClass
                });

            $bgImageElement.css('background-image',  'url("'+src+'")');
            $element.prepend($bgImageElement);

            return $element;
        };

     /* ----------------------------------------
            End of Colorizer
      ---------------------------------------- */


     /* ----------------------------------------
            Breadcrumb
      ---------------------------------------- */

        App.helpers.Breadcrumb = {};
        App.helpers.Breadcrumb.$collection = $();
        App.helpers.Breadcrumb.$w = $(window);

        App.helpers.Breadcrumb.config = {
            until: 767,
            cssPrefix: 'milenia-',
            resizeTimeoutDelay: 10,
            classMap: {
                bgColorElement: 'colorizer-bg-color',
                bgImageElement: 'colorizer-bg-image'
            }
        };

        Object.defineProperties(App.helpers.Breadcrumb, {
            bgColorElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgColorElement;
                }
            },
            bgImageElementClass: {
                get: function() {
                    return this.config.cssPrefix + this.config.classMap.bgImageElement;
                }
            },
            bgsSelectors: {
                get: function() {
                    return '.' + this.bgColorElementClass + ', .' + this.bgImageElementClass;
                }
            }
        });

        App.helpers.Breadcrumb.init = function($breadcrumbs) {
            var self = this;

            if(!$.isjQuery($breadcrumbs, true)) return;

            this._bindEvents();

            $breadcrumbs.each(function(index, element) {
                var $element = $(element);

                if(self.$collection.filter($element).length) return;

                self.initCertainElement($element);
            });
        };

        App.helpers.Breadcrumb._bindEvents = function() {
            var self = this;

            if(!this._eventsBinded) {
                $body.on('spaceremoved.milenia.stickysection', function() {
                    self.$collection.each(function(index, element){
                        self.stretch($(element));
                    });
                });

                this.$w.on('resize', function() {
                    if(self._resizeTimeOutId) clearTimeout(self._resizeTimeOutId);

                    self._resizeTimeOutId = setTimeout(function(){
                        self.$collection.each(function(index, element){
                            self.stretch($(element));
                        });
                    }, self.config.resizeTimeoutDelay);
                });
            }
        };

        App.helpers.Breadcrumb.initCertainElement = function($breadcrumb) {
            this.$collection = this.$collection.add($breadcrumb);

            this.stretch($breadcrumb);
        };

        App.helpers.Breadcrumb.stretch = function($breadcrumb) {
            var $prev = $breadcrumb.prev(),
                prevOH,
                $bgs,
                $stickedSections;

            if($.isjQuery($prev, true)) {
                prevOH = $prev.outerHeight();
                $bgs = $breadcrumb.find(this.bgsSelectors);
                $stickedSections = $('.milenia-header-section--sticked');

                if($bgs.length) {
                    $bgs.css({
                        top: -prevOH
                    });
                }
                if($stickedSections.length) {
                    $bgs.css({
                        top: $stickedSections.outerHeight() * -1
                    });
                }
            }

            return $breadcrumb;
        };

     /* ----------------------------------------
            End of Breadcrumb
      ---------------------------------------- */


    /* ----------------------------------------
        Critical Error
    ---------------------------------------- */

        App.helpers.showCriticalFullScreenMessage = function(config) {
            var _config = {
                after: '',
                before: '',
                content: '',
                cssPrefix: 'milenia-',
                cssClass: ''
            },
            template = '<div class="%cssPrefix%fullscreen-message %cssClass% %cssPrefix%aligner">\
                            <div class="%cssPrefix%aligner-outer">\
                                <div class="%cssPrefix%aligner-inner">\
                                    <div class="%cssPrefix%fullscreen-message-before">%before%</div>\
                                    <div class="%cssPrefix%fullscreen-message-content">%content%</div>\
                                    <div class="%cssPrefix%fullscreen-message-after">%after%</div>\
                                </div>\
                            </div>\
                        </div>';


            config = $.extend(_config, config);

            for(var option in config) {
                template = template.replace(new RegExp('%' + option + '%', 'g'), config[option]);
            }

            $body.html('').addClass(config.cssPrefix + 'body--has-critical-fullscreen-message').append(template);
        };

    /* ----------------------------------------
        End of Critical Error
    ---------------------------------------- */


      /* ----------------------------------------
            Dynamic background image
       ---------------------------------------- */

            App.helpers.dynamicBgImage = function(collection) {
                collection = $.isjQuery(collection) ? collection : $('[data-bg-image-src]');
                if(!collection.length) return;

                return collection.each(function(i, el){
                    var $this = $(el);
                    if( !$this.data('bg-image-src') ) return;

                    $this.css('background-image', 'url("'+ $this.data('bg-image-src') +'")');
                });
            },

       /* ----------------------------------------
            End of Dynamic background image
        ---------------------------------------- */

        /* ----------------------------------------
            Booking Form V2V4
         ---------------------------------------- */

            App.helpers.bookingFormV2V4 = function() {
                $body.on('click.MileniaBookingFormV2V4', '.milenia-booking-form--style-2 .form-control, .milenia-booking-form--style-4 .form-control', function(event) {
                    var $current = $(this),
                        $form = $current.closest('.milenia-booking-form--style-2, .milenia-booking-form--style-4');

                    $current.addClass('form-control--over');

                    $form.find('.form-control').not($current).removeClass('form-control--over');
                });

                $doc.on('click.MileniaBookingFormV2V4', function(event) {
                    var $target = $(event.target);

                    if(!$target.closest('.milenia-booking-form--style-2, .milenia-booking-form--style-4').length) {
                        $('.milenia-booking-form--style-2 .form-control--over, .milenia-booking-form--style-4 .form-control--over').removeClass('form-control--over');
                    }
                });
            };

        /* ----------------------------------------
            End of Booking Form V2
         ---------------------------------------- */

         /* ----------------------------------------
             Booking Form V3
          ---------------------------------------- */

             App.helpers.bookingFormV3 = function() {
                 $body.on('click.MileniaBookingFormV3', '.milenia-booking-form--style-3 [class*="form-col"]', function(event) {
                     var $current = $(this),
                         $form = $current.closest('.milenia-booking-form--style-3');

                     $current.addClass('form-col--over');

                     $form.find('[class*="form-col"]').not($current).removeClass('form-col--over');
                 });

                 $doc.on('click.MileniaBookingFormV3', function(event) {
                     var $target = $(event.target);

                     if(!$target.closest('.milenia-booking-form--style-3').length) {
                         $('.milenia-booking-form--style-3 .form-col--over').removeClass('form-col--over');
                     }
                 });
             };

         /* ----------------------------------------
             End of Booking Form V3
          ---------------------------------------- */

         /* ----------------------------------------
             Toggled fields
          ---------------------------------------- */

            App.helpers.toggledFields = function() {
                $body.off('click.MileniaToggledFields').on('click.MileniaToggledFields', '.milenia-toggled-fields-invoker', function(event) {
                    var $this = $(this),
                        $fields = $this.siblings('.milenia-toggled-fields');

                    $this.toggleClass('milenia-toggled-fields-invoker--opened');

                    if($fields.length) {
                        $fields.stop().slideToggle({
                            duration: App.ANIMATIONDURATION,
                            easing: App.ANIMATIONEASING,
                        });
                    }
                });
            };

         /* ----------------------------------------
             End of Toggled fields
          ---------------------------------------- */


         /* ----------------------------------------
             Calendar Widget
          ---------------------------------------- */

            App.helpers.calendarWidget = function() {
                var $calendar = $('.calendar_wrap'),
                    $caption,
                    $prev,
                    $next;
                if(!$calendar.length || $calendar.hasClass('milenia-calendar-rendered')) return;

                $caption = $calendar.find('caption');

                if(!$caption.length) return;

                $prev = $calendar.find('#prev > a');
                $next = $calendar.find('#next > a');

                if($prev.length) {
                    $('<a></a>', {
                        class: 'calendar-caption-prev milenia-ln--independent',
                        html: App.RTL ? '<i class="icon icon-chevron-right"></i>' : '<i class="icon icon-chevron-left"></i>',
                        href: $prev.attr('href')
                    }).appendTo($caption);
                }

                if($next.length) {
                    $('<a></a>', {
                        class: 'calendar-caption-next milenia-ln--independent',
                        html: App.RTL ? '<i class="icon icon-chevron-left"></i>' : '<i class="icon icon-chevron-right"></i>',
                        href: $next.attr('href')
                    }).appendTo($caption);
                }

                $calendar.addClass('milenia-calendar-rendered');
            };

         /* ----------------------------------------
             End of Calendar Widget
          ---------------------------------------- */


        /* ----------------------------------------
            Owl Carousel helpers
         ---------------------------------------- */

             App.baseOwlSettings = {
                 items: 1,
                 margin: 30,
                 nav: true,
                 rtl: App.RTL,
                 navText: App.RTL ? ['<i class="icon icon-chevron-right"></i>', '<i class="icon icon-chevron-left"></i>'] : ['<i class="icon icon-chevron-left"></i>', '<i class="icon icon-chevron-right"></i>'],
                 dots: false,
                 autoplayHoverPause: true,
                 smartSpeed: App.ANIMATIONDURATION,
                 fluidSpeed: App.ANIMATIONDURATION,
                 autoplaySpeed: App.ANIMATIONDURATION,
                 navSpeed: App.ANIMATIONDURATION,
                 dotsSpeed: App.ANIMATIONDURATION,
                 dragEndSpeed: App.ANIMATIONDURATION,
                 onInitialized: function() {
                     App.helpers.updateGlobalNiceScroll();
                 }
             };

             App.helpers.owlAdaptive = function(collection) {

                 collection = collection ? collection : $('.owl-carousel');
                 if(!collection.length) return;


                 collection.each(function(i, el){

                     var $this = $(el);

                     $this.on('initialized.owl.carousel', function(e){

                         App.helpers.owlUpdateIsotopeParent($this);

                     });

                     $this.on('resized.owl.carousel', function(e){

                         App.helpers.owlContainerHeight($this, true);

                     });

                     $this.on('changed.owl.carousel', function(e){

                         App.helpers.owlContainerHeight($this);

                     });

                 });

             };

             App.helpers.owlContainerHeight = function(owl, resized) {

                 if(owl.hasClass('owl-carousel--vadaptive')) return;

                 setTimeout(function(){

                     var max = 0,
                         items = owl.find('.owl-item'),
                         activeItems = items.filter('.active').children();

                     items.children().css('height', 'auto');

                     activeItems.each(function(i, el){

                         var $this = $(el),
                             height = $this.outerHeight();

                         if(height > max) max = height;

                     });

                     owl.find('.owl-stage-outer').stop().animate({
                         height: max
                     }, {
                         duration: 150,
                         complete: function() {
                            if(!resized) return;
                            App.helpers.owlUpdateIsotopeParent($(this));
                         }
                     });

                 }, 20);

             };

             App.helpers.owlUpdateIsotopeParent = function($owl) {
                 var $isotope = $owl.closest('.milenia-grid--isotope');
                 if($isotope.length) $isotope.isotope('layout');
             };

             App.helpers.owlNav = function(owl) {

                 setTimeout(function(){

                     var settings = owl.data('owl.carousel').settings;
                     if(settings.autoplay || settings.loop) return;

                     var prev = owl.find('.owl-prev'),
                         next = owl.find('.owl-next');

                     if(owl.find('.owl-item').first().hasClass('active')) prev.addClass('milenia-disabled');
                     else prev.removeClass('milenia-disabled');

                     if(owl.find('.owl-item').last().hasClass('active')) next.addClass('milenia-disabled');
                     else next.removeClass('milenia-disabled');

                 }, 100);

             };

             App.helpers.owlSettings = function(settings) {

                 return $.extend(true, {}, App.baseOwlSettings, settings);
             };

             App.helpers.owlSync = {

				init: function() {

					this.collection = $('.owl-carousel[data-sync]');
					if(!this.collection.length) return;

					this.prepare();
				},

				prepare: function(){

					this.collection.each(function(i, el){

						var $this = $(el),
							sync = $($this.data('sync'));

						sync.on('changed.owl.carousel', function(e){

							var index = e.item.index;

							if(!sync.data('afterClicked')) $this.trigger('to.owl.carousel', [index, 350, true]);

							sync.data('afterClicked', false);

						});

						$this.on('prev.owl.carousel', function(){

							sync.trigger('prev.owl.carousel');

						});

						$this.on('next.owl.carousel', function(){

							sync.trigger('next.owl.carousel');

						});

						$this.on('click.owlSync', '.owl-item', function(e){

							e.preventDefault();

							var index = $(this).index();

							sync.data('afterClicked', true);

							sync.trigger('to.owl.carousel', [index, 350, true]);

						});

					});

				}

			};

         /* ----------------------------------------
            End of Owl Carousel helpers
          ---------------------------------------- */

         /* ----------------------------------------
               Rating
          ---------------------------------------- */

            function MileniaRating($element, config) {
                this.$element = $element;
                this.config = $.extend(MileniaRating.config, config);

                Object.defineProperties(this, {
                    bottomLevelElementClass: {
                        get: function() {
                            return this.config.cssPrefix + this.config.classMap.bottomLevelElement;
                        }
                    },
                    topLevelElementClass: {
                        get: function() {
                            return this.config.cssPrefix + this.config.classMap.topLevelElement;
                        }
                    }
                });
            };

            MileniaRating.config = {
                cssPrefix: 'milenia-',
                bottomLevelElements: '<i class="icon icon-star-empty"></i>',
                topLevelElements: '<i class="icon icon-star"></i>',
                estimate: 5,
                rtl: App.RTL,
                classMap: {
                    bottomLevelElement: 'rating-bottom-level',
                    topLevelElement: 'rating-top-level'
                }
            };

            MileniaRating.prototype.init = function() {
                this._buildMarkup();

                return this;
            };

            MileniaRating.prototype._buildMarkup = function() {
                var _self = this;

                if(this._markupBuilded) return;

                this.$element.css({
                    'position': 'relative',
                    'display': 'inline-block'
                });

                if(this.config.topLevelElements) {
                    this.$topLevelEl = $('<div></div>', {
                        class: _self.topLevelElementClass,
                        style: 'position: absolute; top: 0; right: 0; bottom: 0; left: 0; z-index: 2; white-space: nowrap; overflow: hidden;'
                    });

                    for(var i = 0; i < 5; i++) this.$topLevelEl.append(this.config.topLevelElements);

                    this.$element.append(this.$topLevelEl);
                }

                if(this.config.bottomLevelElements) {
                    this.$bottomLevelEl = $('<div></div>', {
                        class: _self.bottomLevelElementClass,
                        style: 'position: relative; z-index: 1;'
                    });

                    for(var i = 0; i < 5; i++) this.$bottomLevelEl.append(this.config.bottomLevelElements);

                    this.$element.append(this.$bottomLevelEl);
                }


                this.update(this.config.estimate);

                this._markupBuilded = true;

                this.$element.trigger('built.milenia.Rating', [this.$element]);
            };

            MileniaRating.prototype.update = function(estimate) {
                if(this.config.topLevelElements) {
                    this.$topLevelEl.css('width', (estimate / 5 * 100) + '%');
                }
                else {
                    if(this.config.bottomLevelElements) {
                        this.$bottomLevelEl.html('');
                        for(var i = 0; i < Math.round(estimate); i++) this.$bottomLevelEl.append(this.config.bottomLevelElements);
                    }
                }
            };

            App.helpers.rating = function($collection, config) {
                config = config || {};

                if(!$.isjQuery($collection) || !$collection.length) return $collection;

                return $collection.each(function(index, element) {
                    var $element = $(element),
                        elementConfig = $.extend(true, {}, config, {estimate: $element.data('estimate')});

                    if(!$element.data('Rating')) $element.data('Rating', new MileniaRating($element, elementConfig).init());
                });
            };



            App.helpers.ratingField = function($collection) {
                if(!$.isjQuery($collection)) return;

                $collection.on('click.MileniaRatingField', '.icon', function(event) {
                    var $icon = $(this),
                        $rating = $icon.closest('[data-estimate]'),
                        index = $icon.index() + 1,
                        Rating = $rating.data('Rating'),
                        $field = $rating.siblings('input[type="hidden"]');

                    if(Rating) {
                        Rating.update( App.RTL ? 6 - index : index);

                        if($field.length) {
                            $field.val(index);
                        }
                    }

                    event.preventDefault();
                    event.stopPropagation();
                });
            };

         /* ----------------------------------------
               End of Rating
          ---------------------------------------- */

         /* ----------------------------------------
               Touch hover emulator
          ---------------------------------------- */

            App.helpers.touchHoverEmulator = function($container, targetSelector, itemSelector) {
                if(!App.ISTOUCH || !$.isjQuery($container) || !$container.length) return;

                var hoverClass = 'milenia-touch-hover',
                    preventedClass = 'milenia-event-prevented';

                $container.on('click.touchHoverEmulator', targetSelector, function(event){
                    var $link = $(this),
                        $items,
                        $targets,
                        $item = $link.closest(itemSelector);

                    if($link.get(0).tagName.toUpperCase() != 'A') return;

                    $items = $container.find(itemSelector);
                    if($items.not($item).length) $items.not($item).removeClass(hoverClass);

                    $targets = $container.find(targetSelector);
                    if($targets.not($link).length) $targets.not($link).removeClass(preventedClass);

                    if(!$link.hasClass(preventedClass)) {
                        $link.addClass(preventedClass);
                        if($item.length) $item.addClass(hoverClass);

                        event.preventDefault();
                    }
                });
            };

         /* ----------------------------------------
               End Touch hover emulator
          ---------------------------------------- */


         /* ----------------------------------------
               Revolution slider helpers
          ---------------------------------------- */

            App.helpers.revArrowsOutside = function() {
                if(window.MileniaRevArrowsOutsideEvents) return;

                $body.on('click.revArrowsOutside', '.milenia-rev-arrows-prev, .milenia-rev-arrows-next', function(event) {
                    var $button = $(this),
                        $nav = $button.closest('.milenia-rev-arrows-outside'),
                        revApi;


                    if(!$nav.length) return;

                    revApi = window[$nav.data('rev-api')];

                    if(!revApi) return;

                    revApi[$button.hasClass('milenia-rev-arrows-prev') ? 'revprev' : 'revnext']();

                    event.preventDefault();
                });

                window.MileniaRevArrowsOutsideEvents = true;
            };

         /* ----------------------------------------
               End Revolution slider helpers
          ---------------------------------------- */

         /* ----------------------------------------
               gridOwl
          ---------------------------------------- */

            App.helpers.gridOwl = {
                _commonLayoutConfig: {
                    'columns-4': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            768: {
                                items: 2
                            },
                            1200: {
                                items: 4
                            }
                        }
                    },
                    'columns-4-sidebar': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            992: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            }
                        }
                    },
                    'columns-3': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            768: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            }
                        }
                    },
                    'columns-3-sidebar': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            992: {
                                items: 2
                            },
                            1200: {
                                items: 3
                            }
                        }
                    },
                    'columns-2': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            768: {
                                items: 2
                            }
                        }
                    },
                    'columns-2-sidebar': {
                        responsive: {
                            0: {
                                items: 1
                            },
                            992: {
                                items: 2
                            }
                        }
                    }
                },
                _$collection: $(),
                _individualConfigs: {}
            };

            /**
             * Initializes the gridOwl helper
             * @param {jQuery} $collection
             *
             * @returns {jQuery}
             */
            App.helpers.gridOwl.init = function($collection) {
                var self = this;

                $collection = $.isjQuery($collection) ? $collection : $('.milenia-grid.owl-carousel');

                 $collection.each(function(index, element){
                    var $element = $(element);

                    if(self._$collection.filter($element).length) return;

                    self._$collection = self._$collection.add($element);
                });

                this.update();

                return $collection;
            };

            /**
             * Modifies config for the elements with parents that match specified selector.
             * @param {String} selector
             * @param {Object} config
             *
             * @returns {Object}
             */
            App.helpers.gridOwl.extendConfigFor = function(selector, config) {
                this._individualConfigs[selector] = config;

                return this;
            };

            /**
             * Adds new carousel to the collection
             *
             * @param {jQuery} $carousel
             *
             * @returns {Object}
             */
            App.helpers.gridOwl.add = function($carousel) {
                if($.isjQuery($carousel) && !this._$collection.filter($carousel).length) {
                    this._$collection = this._$collection.add($carousel);
                    this.update();
                }

                return this;
            };

            /**
             * Initializes not initialized carousels.
             *
             * @returns {Object}
             */
            App.helpers.gridOwl.update = function() {
                var self = this;

                this._$collection.each(function(index, element){
                    var $element = $(element),
                        config = {},
                        columnsCount,
                        layoutConfigProp;

                    if($element.data('owl.carousel')) return;

                    // detect layout settings
                    columnsCount = self._getColumnsCount($element);

                    if(columnsCount > 1) {
                        // check if sidebar
                        if($element.closest('.milenia-has-sidebar').length) {
                            layoutConfigProp = 'columns-' + columnsCount + '-sidebar';
                        }
                        else {
                            layoutConfigProp = 'columns-' + columnsCount;
                        }

                        $.extend(config, self._commonLayoutConfig[layoutConfigProp]);
                    }

                    for(var selector in self._individualConfigs) {
                        if($element.closest(selector).length) {
                            $.extend(config, self._individualConfigs[selector]);

                            if($element.closest('.milenia-has-sidebar').length) {
                                config.responsive = config.responsiveWithSidebar;
                            }
                        }
                    }


                    $element.owlCarousel(App.helpers.owlSettings(config));
                });

                return this;
            };

            /**
             * Returns amount of columns in the specified element.
             *
             * @param {jQuery} $element
             * @returns {Number}
             */
            App.helpers.gridOwl._getColumnsCount = function($element) {
                if($element.hasClass('milenia-grid--cols-4')) return 4;
                else if($element.hasClass('milenia-grid--cols-3')) return 3;
                else if($element.hasClass('milenia-grid--cols-2')) return 2;

                return 1;
            };

         /* ----------------------------------------
               End of gridOwl
          ---------------------------------------- */

         /* ----------------------------------------
               Full Screen Area
          ---------------------------------------- */

            App.helpers.fullScreenArea = {
            	init: function(config){

            		var self = this;

            		this.collection = $('.milenia-fullscreen-area');
            		if(!this.collection.length) return;

                    this.config = config || {};
            		this.defPaddingTop = parseInt(this.collection.css('padding-top'), 10);
            		this.defPaddingBottom = parseInt(this.collection.css('padding-bottom'), 10);

            		this.w = $(window);
                    this.$body = $body;

            		this.run();

            		this.w.on('resize.fullscreen', function() {
                        self.run();
                    });

            		return this.collection;

            	},

            	reset: function(){

            		if(!this.collection) return;

            		this.run();

            	},

            	updateDocumentState: function(){

            		var self = this;

            		this.collection.css({
            			'padding-top': self.defPaddingTop,
            			'padding-bottom': self.defPaddingBottom
            		});

            		this.cH = this.collection.outerHeight();

                    this.eH = this.config.except && this.config.except.length ? this.getTotalHeightOfExceptedElements() : 0;
                    this.documentPadding = parseInt(this.$body.css('padding-top'), 10) + parseInt(this.$body.css('padding-bottom'), 10);

                    this.wH = this.w.height();

            	},

                getTotalHeightOfExceptedElements: function() {
                    return this.config.except.toArray().reduce(function(accumulator, currentValue, index, array){
                        return accumulator + $(currentValue).outerHeight();
                    }, 0);
                },

            	run: function(){

            		var self = this;

            		this.updateDocumentState();

            		if(this.timeoutId) clearTimeout(this.timeoutId);

            		this.timeoutId = setTimeout(function(){

            			if(self.cH < self.wH){

            				var diff = (self.wH - self.cH) / 2;

            				self.collection.css({
            					'padding-top': diff + self.defPaddingTop - ((self.eH + self.documentPadding)/2),
            					'padding-bottom': diff + self.defPaddingBottom - ((self.eH + self.documentPadding)/2)
            				});

            			}

                        self.collection.addClass('milenia-fullscreen-area--ready');

            		}, 100);

            	}

            };

         /* ----------------------------------------
               End of Full Screen Area
          ---------------------------------------- */

         /* ----------------------------------------
               owlSyncTabbed
          ---------------------------------------- */

            App.helpers.owlSyncTabbed = {};
            App.helpers.owlSyncTabbed.init = function($collection) {
                var _self = this,
                    $w = $(window);

                if(!$.isjQuery($collection)) return;

                $collection.on('click', '.owl-item', this.changeTab);
                $collection.on('translated.owl.carousel', function(event) {
                    var $this = $(this),
                        OWL = $this.data('owl.carousel');

                    if($.isPlainObject(OWL.options.responsive)) {
                        for(var screenSize in OWL.options.responsive) {
                            if(OWL.options.responsive[screenSize]['items'] == 1 && $w.width() < 480) {
                                $this.find('.owl-item.active').trigger('click');
                            }
                        }
                    }

                });

                this.setCurrentSlideClass($collection);
            };

            App.helpers.owlSyncTabbed.changeTab = function(event) {
                var $this = $(this),
                    index = $this.index(),
                    $carousel = $this.closest('.owl-carousel[data-tabbed-sync]'),
                    $tabbedContainer;


                if($carousel.length) {
                    $tabbedContainer = $('#' + $carousel.data('tabbed-sync'));

                    if($tabbedContainer.length && $tabbedContainer.data('TabbedGrid')) {
                        $tabbedContainer.data('TabbedGrid').show(index);
                        $this.addClass('milenia-grid--tabbed-active').siblings().removeClass('milenia-grid--tabbed-active');
                    }
                }

                event.preventDefault();
                event.stopPropagation();
            };

            App.helpers.owlSyncTabbed.setCurrentSlideClass = function($collection) {
                var self = this;

                if(!$collection.length) return $();

                $collection.on('initialized.owl.carousel', function() {
                    self.setCurrentSlideClassToCarousel($(this));
                });

                return $collection.each(function(index, element) {
                    self.setCurrentSlideClassToCarousel($(element));
                });
            };

            App.helpers.owlSyncTabbed.setCurrentSlideClassToCarousel = function($element) {
                var $tabbedContainer = $('#' + $element.data('tabbed-sync')),
                    $items,
                    $currentItem;

                if($tabbedContainer.length) {
                    $items = $element.find('.owl-item');

                    if($items.length) {
                        $tabbedContainer.on('item.shown.tabbedgrid', function(event, $container){
                            if($element.data('synced')) return;

                            $currentItem = $items.eq($container.data('TabbedGrid').getCurrentItemIndex());
                            if($currentItem.length) $currentItem.addClass('milenia-grid--tabbed-active');

                            $element.data('synced', true);
                        });
                    }
                }
            };

         /* ----------------------------------------
               End of owlSyncTabbed
          ---------------------------------------- */

         /* ----------------------------------------
               Google Maps
          ---------------------------------------- */

            App.modules.GoogleMaps = {
            	config: {
            		map_options: {
            			zoom: 16,
            			scrollwheel: false
            		},
            		locations: [
            			{
            				lat: 40.7707307,
            				lon: -74.0210859,
            				icon: 'images/marker.png',
            				title: 'Main office'
            			}
            		],
            		generate_controls: false,
            		controls_on_map: false,
            		view_all: false

            	},

            	init: function(config){

            		var self = this;

            		this.collection = $('.milenia-gmap');
            		if(!this.collection.length) return;

            		this.MapPlaceCollection = [];

            		if(config) $.extend(this.config, config);

            		this.collection.each(function(i, el){

            			var $this = $(el),
            				options = {};

            			if($this.data('locations')) options.locations = $this.data('locations');
            			if($this.data('height')) $this.css('height', $this.data('height'));

            			options.map_div = '#' + $this.attr('id');

            			self.MapPlaceCollection.push(new Maplace($.extend({}, self.config, options)).Load());

            		});

            		this.bindEvents();

            	},

            	bindEvents: function(){

            		var self = this;

            		$(window).on('resize.map', function(){

            			if(self.mapTimeoutId) clearTimeout(self.mapTimeoutId);

            		 	self.mapTimeoutId = setTimeout(function(){

            			 	self.MapPlaceCollection.forEach(function(elem, index, arr){
            			 		elem.Load();
            			 	});

            			 }, 100);

                    });

            	}

            }

            /* ----------------------------------------
                End of Google Maps
            ---------------------------------------- */

    $.extend({
        isjQuery: function(element, elementExists) {
			if(element === undefined || element === null) return false;

			if(elementExists === undefined) {
				return element instanceof jQuery;
			}
			else {
				return $.isjQuery(element) && element.length;
			}
		}
    });

    $.fn.extend({
        jQueryImagesLoaded : function () {
		    var $imgs = this.find('img[src!=""]');

		    if (!$imgs.length) {return $.Deferred().resolve().promise();}

		    var dfds = [];

		    $imgs.each(function(){
		        var dfd = $.Deferred();
		        dfds.push(dfd);
		        var img = new Image();
		        img.onload = function(){dfd.resolve();};
		        img.onerror = function(){dfd.resolve();};
		        img.src = this.src;
		    });

		    return $.when.apply($,dfds);
		}
    });

    $doc.on('beforeClose', function(event) {
        if($(event.target).hasClass('milenia-modal')) {
            event.stopImmediatePropagation();
        }
    });

    $doc.ready(function() {
        App.afterDOMReady();
    });
    $(window).on('load', function() {

        DOMDfd.done(function() {
            App.afterOuterResourcesLoaded();
        });
    });

    return App;

})(window.jQuery);
