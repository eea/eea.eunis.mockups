(function($) {
    $(function() {

        // table definition dropdown
        $('.table-definition-target').click(function () { showDefinition(this);});

        var $content = $("#content");

        $("a").filter("[rel]").each(function () {

            if (!$content.find(this.rel).hasClass('overlay')) {
                return;
            }
            $(this).overlay({
                // common configuration for each overlay
                oneInstance: false,
                closeOnClick: true,
                top: '15%',
                onBeforeLoad: function () {
                    var $overlay = this.getOverlay(),
                        $trigger, text, uppercase_text;
                    // create overlay title if not found in the overlay body
                    if (!$overlay.find('.overlay-title').length) {
                        $trigger = this.getTrigger();
                        text = $trigger.text();
                        uppercase_text = text.charAt(0).toUpperCase() + text.substring(1, text.length);
                        $("<h3 />").attr({'class': 'overlay-title'}).html(uppercase_text).prependTo($overlay);
                    }
                    // wrap overlay content so that we can have a maximum height with overflow
                    if (!$overlay.find('.overlay-body').length) {
                        $overlay.children().wrapAll('<div class="overlay-body" />');
                    }
                }

            });
        });


        // galleryView override
        if ($.fn.galleryView !== undefined) {
            $.fn.eeaGalleryView = function(opts) {
                return this.each(function(){
                    var $this = $(this);
                    var $gallery_parent = $this.parent(),
                        $gallery_class = $gallery_parent[0].className,
                        parent_width, parent_height,
                        gallery_width, gallery_height;
                    parent_width = $gallery_parent.width() - 10;
                    parent_height = Math.round((parent_width /4)*3);
                    gallery_width = $gallery_class === 'gallery_fancybox_view' ? 640 : parent_width;
                    gallery_height = $gallery_class === 'gallery_fancybox_view' ? 433 : parent_height;
                    // added possibility to override the width and height of the gallery by passing in
                    // a width and/or height to the gallery
                    var gallery_style_attr = $this.attr('style');
                    if (gallery_style_attr){
                        gallery_width = gallery_style_attr.indexOf('width') !== -1 ? $this.width() : gallery_width;
                        gallery_height = gallery_style_attr.indexOf('height') !== -1 ? $this.height() : gallery_height;
                    }

                    var defaults = {
                        panel_width: gallery_width,
                        panel_height: gallery_height,
                        frame_width: 50,
                        frame_height: 50,
                        transition_speed: 350,
                        transition_interval: 10000,
                        zIndex: 90
                    };

                    if ($this.hasClass('js-noFilmstrip')) {
                        defaults.show_filmstrip = false;
                    }
                    var options = $.extend(defaults, opts);
                    var data_options = $this.data('options');
                    if (data_options) {
                        try {
                            data_options = $.parseJSON(data_options);
                            options = $.extend(data_options, options);
                        }
                        catch(e) {
                            var console = window.console || { log: function() {} };
                            console.log('Non Valid JSON passed as');
                        }
                    }

                    $this.galleryView(options);
                });

            };
            $(".galleryViews").eeaGalleryView();
        }

    });

    function showDefinition(context) {
        var $context = $(context);
        if (!$context.hasClass('opened')) {
            $context.closest('.table-definition').find('.table-definition-body').slideDown();
            $context.addClass('opened');
        }
        else {
            $context.closest('.table-definition').find('.table-definition-body').slideUp();
            $context.removeClass('opened');
        }
    }

    $(document).ready(function(){
        var buttons = { previous:$('#prev-promo') ,
            next:$('#next-promo')  };

        var small_navigator = $("#promo-navigator-sm"),
            site_address = small_navigator.length ? true : undefined,
            nav_height = site_address ? 50 : 80,
            nav_width = site_address ? 65 : 170,
            nav_items_selector = site_address ? "#promo-navigator-sm li" : "#promo-navigator li",
            wrapper_selector = site_address ? "#promo-gallery-content-sm" : "#promo-gallery-content",
            max_item_display = site_address ? 5 : 3,
            nav_position = site_address ? 'horizontal' : 'vertical',
            nav_outer_selector = site_address ? "#navigator-outer-sm" : "#navigator-outer";

        var threat_levels = {
            "favourable"   : ["threat-status-vu", "threat-status-nt", "threat-status-lc",
                             "threat-status-lrc", "threat-status-lrn", "threat-status-lrl",
                             "threat-status-lr", "threat-status-un", "threat-status-dd"],

            "unfavourable" : ["threat-status-cr", "threat-status-en"],

            "extincted"   : ["threat-status-ex", "threat-status-ew"]
        };

        function onComplete(slider) {
            var threat_class = slider.find('.promo-item-desc p').attr('class'),
                $gallery = $(slider.context),
                $threat_status = $gallery.find('.threat-status-text'),
                level;
            $threat_status.find('li').removeClass('selected');
//            $threat_status.find(dave.favorable).addClass('selected');
            for ( level in threat_levels ) {
                if (threat_levels.hasOwnProperty(level)) {
                    if ( threat_levels[level].indexOf(threat_class) !== -1 ) {
                        $threat_status.find('.' + level).addClass('selected');
                    }
                }
            }

        }

        var settings = {
            interval            : 9000,
            direction           : 'opacity',
            duration            : 1500,
            wrapperSelector     : wrapper_selector,
            navItemsSelector    : nav_items_selector,
            navOuterSelector    : nav_outer_selector,
            isPreloaded         : false,
            maxItemDisplay      : max_item_display,
            navigatorHeight     : nav_height,
            navigatorWidth      : nav_width,
            navPosition         : nav_position,
            auto                : true,
            caption             : '.promo-item-desc',
            opacityClass        : 'lof-opacity',
            buttons             : buttons,
            mainWidth           : "100%",
            onComplete          : onComplete
        };

        $('#promo-gallery-wrapper').lofJSlider(settings);
    });
})(jQuery);


/*

 GalleryView - jQuery Content Gallery Plugin
 Author: 		Jack Anderson
 Version:		2.0 (May 5, 2009)
 Documentation: 	http://www.spaceforaname.com/galleryview/

 Please use this development script if you intend to make changes to the
 plugin code.  For production sites, please use jquery.galleryview-2.0-pack.js.

 See CHANGELOG.txt for a review of changes and LICENSE.txt for the applicable
 licensing information.


 */

//Global variable to check if window is already loaded
//Used for calling GalleryView after page has loaded
var window_loaded = false;

(function($){
    $.fn.galleryView = function(options) {
        var opts = $.extend($.fn.galleryView.defaults,options);

        var id;
        var iterator = 0;
        var item_count = 0;
        var slide_method;
        var paused = false;

        //Element dimensions
        var gallery_width;
        var gallery_height;
        var pointer_height;
        var pointer_width;
        var strip_width;
        var strip_height;
        var wrapper_width;
        var f_frame_width;
        var f_frame_height;
        var frame_caption_size = 20;
        var gallery_padding;
        var filmstrip_margin;
        var filmstrip_orientation;


        //Arrays used to scale frames and panels
        var frame_img_scale = new Object();
        var panel_img_scale = new Object();
        var img_h = new Object();
        var img_w = new Object();

        //Flag indicating whether to scale panel images
        var scale_panel_images = true;

        var panel_nav_displayed = false;

        //Define jQuery objects for reuse
        var j_gallery;
        var j_filmstrip;
        var j_frames;
        var j_frame_img_wrappers;
        var j_panels;
        var j_pointer;


        /************************************************/
        /*	Plugin Methods								*/
        /************************************************/

            //Transition from current item to item 'i'
        function showItem(i) {
            //Disable next/prev buttons until transition is complete
            if(opts.hover_nav_buttons_images) {
                $('.nav-next-overlay',j_gallery).unbind('click');
                $('.nav-prev-overlay',j_gallery).unbind('click');
            }
            $('.nav-next',j_gallery).unbind('click');
            $('.nav-prev',j_gallery).unbind('click');
            j_frames.unbind('click');

            //Fade out all frames while fading in target frame
            if(opts.show_filmstrip) {
                j_frames.removeClass('current').find('img').stop().animate({
                    'opacity':opts.frame_opacity
                },opts.transition_speed);
                j_frames.eq(i).addClass('current').find('img').stop().animate({
                    'opacity':1.0
                },opts.transition_speed);
            }

            //If the gallery has panels and the panels should fade, fade out all panels while fading in target panel
            if(opts.show_panels && opts.fade_panels) {
                j_panels.fadeOut(opts.transition_speed).eq(i%item_count).fadeIn(opts.transition_speed,function(){
                    if(!opts.show_filmstrip) {
                        if(opts.hover_nav_buttons_images) {
                            $('.nav-prev-overlay',j_gallery).click(showPrevItem);
                            $('.nav-next-overlay',j_gallery).click(showNextItem);
                        }
                        $('.nav-prev',j_gallery).click(showPrevItem);
                        $('.nav-next',j_gallery).click(showNextItem);
                    }
                });
            }

            //If gallery has a filmstrip, handle animation of frames
            if(opts.show_filmstrip) {
                //Slide either pointer or filmstrip, depending on transition method
                if(slide_method=='strip') {
                    //Stop filmstrip if it's currently in motion
                    j_filmstrip.stop();

                    if(filmstrip_orientation=='horizontal') {
                        //Determine distance between pointer (eventual destination) and target frame
                        var distance = getPos(j_frames[i]).left - (getPos(j_pointer[0]).left+(pointer_width/2)-(f_frame_width/2));
                        var diststr = (distance>=0?'-=':'+=')+Math.abs(distance)+'px';

                        //Animate filmstrip and slide target frame under pointer
                        j_filmstrip.animate({
                            'left':diststr
                        },opts.transition_speed,opts.easing,function(){
                            //Always ensure that there are a sufficient number of hidden frames on either
                            //side of the filmstrip to avoid empty frames
                            var old_i = i;
                            if(i>item_count) {
                                i = i%item_count;
                                iterator = i;
                                j_filmstrip.css('left','-'+((f_frame_width+opts.frame_gap)*i)+'px');
                            } else if (i<=(item_count-strip_size)) {
                                i = (i%item_count)+item_count;
                                iterator = i;
                                j_filmstrip.css('left','-'+((f_frame_width+opts.frame_gap)*i)+'px');
                            }
                            //If the target frame has changed due to filmstrip shifting,
                            //Make sure new target frame has 'current' class and correct size/opacity settings
                            if(old_i != i) {
                                j_frames.eq(old_i).removeClass('current').find('img').css({
                                    'opacity':opts.frame_opacity
                                });
                                j_frames.eq(i).addClass('current').find('img').css({
                                    'opacity':1.0
                                });
                            }
                            if(!opts.fade_panels) {
                                j_panels.hide().eq(i%item_count).show();
                            }

                            //Enable navigation now that animation is complete

                            if(opts.hover_nav_buttons_images) {
                                $('.nav-prev-overlay',j_gallery).click(showPrevItem);
                                $('.nav-next-overlay',j_gallery).click(showNextItem);
                            }
                            $('.nav-prev',j_gallery).click(showPrevItem);
                            $('.nav-next',j_gallery).click(showNextItem);
                            enableFrameClicking();
                        });
                    } else {
                        //Determine distance between pointer (eventual destination) and target frame
                        var distance = getPos(j_frames[i]).top - (getPos(j_pointer[0]).top+(pointer_height)-(f_frame_height/2));
                        var diststr = (distance>=0?'-=':'+=')+Math.abs(distance)+'px';

                        //Animate filmstrip and slide target frame under pointer
                        j_filmstrip.animate({
                            'top':diststr
                        },opts.transition_speed,opts.easing,function(){
                            //Always ensure that there are a sufficient number of hidden frames on either
                            //side of the filmstrip to avoid empty frames
                            var old_i = i;
                            if(i>item_count) {
                                i = i%item_count;
                                iterator = i;
                                j_filmstrip.css('top','-'+((f_frame_height+opts.frame_gap)*i)+'px');
                            } else if (i<=(item_count-strip_size)) {
                                i = (i%item_count)+item_count;
                                iterator = i;
                                j_filmstrip.css('top','-'+((f_frame_height+opts.frame_gap)*i)+'px');
                            }
                            //If the target frame has changed due to filmstrip shifting,
                            //Make sure new target frame has 'current' class and correct size/opacity settings
                            if(old_i != i) {
                                j_frames.eq(old_i).removeClass('current').find('img').css({
                                    'opacity':opts.frame_opacity
                                });
                                j_frames.eq(i).addClass('current').find('img').css({
                                    'opacity':1.0
                                });
                            }
                            if(!opts.fade_panels) {
                                j_panels.hide().eq(i%item_count).show();
                            }

                            //Enable navigation now that animation is complete
                            if(opts.hover_nav_buttons_images) {
                                $('.nav-prev-overlay',j_gallery).click(showPrevItem);
                                $('.nav-next-overlay',j_gallery).click(showNextItem);
                            }
                            $('.nav-prev',j_gallery).click(showPrevItem);
                            $('.nav-next',j_gallery).click(showNextItem);
                            enableFrameClicking();
                        });
                    }
                } else if(slide_method=='pointer') {
                    //Stop pointer if it's currently in motion
                    j_pointer.stop();
                    //Get position of target frame
                    var pos = getPos(j_frames[i]);

                    if(filmstrip_orientation=='horizontal') {
                        //Slide the pointer over the target frame
                        j_pointer.animate({
                            'left':(pos.left+(f_frame_width/2)-(pointer_width/2)+'px')
                        },opts.transition_speed,opts.easing,function(){
                            if(!opts.fade_panels) {
                                j_panels.hide().eq(i%item_count).show();
                            }
                            if(opts.hover_nav_buttons_images) {
                                $('.nav-prev-overlay',j_gallery).click(showPrevItem);
                                $('.nav-next-overlay',j_gallery).click(showNextItem);
                            }
                            $('.nav-prev',j_gallery).click(showPrevItem);
                            $('.nav-next',j_gallery).click(showNextItem);
                            enableFrameClicking();
                        });
                    } else {//Slide the pointer over the target frame
                        j_pointer.animate({
                            'top':(pos.top+(f_frame_height/2)-(pointer_height)+'px')
                        },opts.transition_speed,opts.easing,function(){
                            if(!opts.fade_panels) {
                                j_panels.hide().eq(i%item_count).show();
                            }
                            if(opts.hover_nav_buttons_images) {
                                $('.nav-prev-overlay',j_gallery).click(showPrevItem);
                                $('.nav-next-overlay',j_gallery).click(showNextItem);
                            }
                            $('.nav-prev',j_gallery).click(showPrevItem);
                            $('.nav-next',j_gallery).click(showNextItem);
                            enableFrameClicking();
                        });
                    }
                }

            }
        };

        //Find padding and border widths applied to element
        //If border is non-numerical ('thin','medium', etc) set to zero
        function extraWidth(el) {
            if(!el) return 0;
            if(el.length==0) return 0;
            el = el.eq(0);
            var ew = 0;
            ew += getInt(el.css('paddingLeft'));
            ew += getInt(el.css('paddingRight'));
            ew += getInt(el.css('borderLeftWidth'));
            ew += getInt(el.css('borderRightWidth'));
            return ew;
        }
        //Find padding and border heights applied to element
        //If border is non-numerical ('thin','medium', etc) set to zero
        function extraHeight(el) {
            if(!el) return 0;
            if(el.length==0) return 0;
            el = el.eq(0);
            var eh = 0;
            eh += getInt(el.css('paddingTop'));
            eh += getInt(el.css('paddingBottom'));
            eh += getInt(el.css('borderTopWidth'));
            eh += getInt(el.css('borderBottomWidth'));
            return eh;
        }

        //Halt transition timer, move to next item, restart timer
        function showNextItem() {

            $(document).stopTime("transition");
            if(++iterator==j_frames.length) {iterator=0;}
            showItem(iterator);
            if(!paused) {
                $(document).everyTime(opts.transition_interval,"transition",function(){
                    showNextItem();
                });
            }
        };

        //Halt transition timer, move to previous item, restart timer
        function showPrevItem() {
            $(document).stopTime("transition");
            if(--iterator<0) {iterator = item_count-1;}
            showItem(iterator);
            if(!paused) {
                $(document).everyTime(opts.transition_interval,"transition",function(){
                    showNextItem();
                });
            }
        };

        //Get absolute position of element in relation to top-left corner of gallery
        //If el=gallery, return position of gallery within browser viewport
        function getPos(el) {
            var left = 0, top = 0;
            var el_id = el.id;
            if(el.offsetParent) {
                do {
                    left += el.offsetLeft;
                    top += el.offsetTop;
                } while(el = el.offsetParent);
            }
            //If we want the position of the gallery itself, return it
            if(el_id == id) {return {'left':left,'top':top};}
            //Otherwise, get position of element relative to gallery
            else {
                var gPos = getPos(j_gallery[0]);
                var gLeft = gPos.left;
                var gTop = gPos.top;

                return {'left':left-gLeft,'top':top-gTop};
            }
        }

        //Add onclick event to each frame
        function enableFrameClicking() {
            j_frames.each(function(i){
                //If there isn't a link in this frame, set up frame to slide on click
                //Frames with links will handle themselves
                if($('a',this).length==0) {
                    $(this).click(function(){
                        if(iterator!=i) {
                            $(document).stopTime("transition");
                            showItem(i);
                            iterator = i;
                            if(!paused) {
                                $(document).everyTime(opts.transition_interval,"transition",function(){
                                    showNextItem();
                                });
                            }
                        }
                    });
                }
            });
        }

        //Construct gallery panels from '.panel' <div>s
        function buildPanels() {
            //If there are panel captions, add overlay divs
            j_panels.each(function(i){
                if($('.panel-overlay',this).length>0) {
                    $(this).append('<div class="overlay-background"></div>');
                }
            });
            if(!opts.show_filmstrip) {
                //Add navigation buttons
                $('<img />').addClass('nav-next').attr('src',opts.theme_path+opts.nav_theme+'/next.gif').appendTo(j_gallery).css({
                    'top':((opts.panel_height-22)/2)+gallery_padding+'px',
                    'display':'none'
                }).click(showNextItem);

                $('<img />').addClass('nav-prev').attr('src',opts.theme_path+opts.nav_theme+'/prev.gif').appendTo(j_gallery).css({
                    'top':((opts.panel_height-22)/2)+gallery_padding+'px',
                    'display':'none'
                }).click(showPrevItem);

                if(opts.hover_nav_buttons_images) {
                    $('<img />').addClass('nav-next-overlay').attr('src',opts.theme_path+opts.nav_theme+'/panel-nav-next.gif').appendTo(j_gallery).css({
                        'top':((opts.panel_height-22)/2)+gallery_padding-10+'px',
                        'display':'none'
                    }).click(showNextItem);

                    $('<img />').addClass('nav-prev-overlay').attr('src',opts.theme_path+opts.nav_theme+'/panel-nav-prev.gif').appendTo(j_gallery).css({
                        'top':((opts.panel_height-22)/2)+gallery_padding-10+'px',
                        'display':'none'
                    }).click(showPrevItem);
                }
            }

            j_panels.each(function(i){
                $(this).css({
                    'width':(opts.panel_width-extraWidth(j_panels))+'px',
                    'height':(opts.panel_height-extraHeight(j_panels))+'px',
                    'position':'absolute',
                    'overflow':'hidden',
                    'display':'none'
                });
                switch(opts.filmstrip_position) {
                    case 'top': $(this).css({
                        'top':strip_height+Math.max(gallery_padding,filmstrip_margin)+'px',
                        'left':gallery_padding+'px'
                    }); break;
                    case 'left': $(this).css({
                        'top':gallery_padding+'px',
                        'left':strip_width+Math.max(gallery_padding,filmstrip_margin)+'px'
                    }); break;
                    default: $(this).css({'top':gallery_padding+'px','left':gallery_padding+'px'}); break;
                }
            });
            $('.panel-overlay',j_panels).css({
                'position':'absolute',
                'zIndex': opts.zIndex,
                'width':(opts.panel_width-extraWidth($('.panel-overlay',j_panels)))+'px',
                'left':'0'
            });
            $('.overlay-background',j_panels).css({
                'position':'absolute',
                'zIndex':opts.zIndex - 1,
                'width':opts.panel_width+'px',
                'left':'0',
                'opacity':opts.overlay_opacity
            });
            if(opts.overlay_position=='top') {
                $('.panel-overlay',j_panels).css('top',0);
                $('.overlay-background',j_panels).css('top',0);
            } else {
                $('.panel-overlay',j_panels).css('bottom',0);
                $('.overlay-background',j_panels).css('bottom',0);
            }

            $('.panel iframe',j_panels).css({
                'width':opts.panel_width+'px',
                'height':opts.panel_height+'px',
                'border':'0'
            });

            if(scale_panel_images) {
                $('img',j_panels).each(function(i){
                    $(this).css({
                        'height':panel_img_scale[i%item_count]*img_h[i%item_count],
                        'width':panel_img_scale[i%item_count]*img_w[i%item_count],
                        'position':'relative',
                        'top':(opts.panel_height-(panel_img_scale[i%item_count]*img_h[i%item_count]))/2+'px',
                        'left':(opts.panel_width-(panel_img_scale[i%item_count]*img_w[i%item_count]))/2+'px'
                    });
                });
            }
        }

        //Construct filmstrip from '.filmstrip' <ul>
        function buildFilmstrip() {
            //Add wrapper to filmstrip to hide extra frames
            j_filmstrip.wrap('<div class="strip_wrapper"></div>');
            if(slide_method=='strip') {
                j_frames.clone().appendTo(j_filmstrip);
                j_frames.clone().appendTo(j_filmstrip);
                j_frames = $('li',j_filmstrip);
            }
            //If captions are enabled, add caption divs and fill with the image titles
            if(opts.show_captions) {
                j_frames.append('<div class="caption"></div>').each(function(i){
                    $(this).find('.caption').html($(this).find('img').attr('title'));
                    //$(this).find('.caption').html(i);
                });
            }
            j_filmstrip.css({
                'listStyle':'none',
                'margin':'0',
                'padding':'0',
                'width':strip_width+'px',
                'position':'absolute',
                'zIndex': opts.zIndex,
                'top':(filmstrip_orientation=='vertical' && slide_method=='strip'?-((f_frame_height+opts.frame_gap)*iterator):0)+'px',
                'left':(filmstrip_orientation=='horizontal' && slide_method=='strip'?-((f_frame_width+opts.frame_gap)*iterator):0)+'px',
                'height':strip_height+'px'
            });
            j_frames.css({
                'float':'left',
                'position':'relative',
                'height':f_frame_height+(opts.show_captions?frame_caption_size:0)+'px',
                'width':f_frame_width+'px',
                'zIndex': opts.zIndex + 1,
                'padding':'0',
                'cursor':'pointer'
            });
            switch(opts.filmstrip_position) {
                case 'top': j_frames.css({
                    'marginBottom':filmstrip_margin+'px',
                    'marginRight':opts.frame_gap+'px'
                }); break;
                case 'bottom': j_frames.css({
                    'marginTop':filmstrip_margin+'px',
                    'marginRight':opts.frame_gap+'px'
                }); break;
                case 'left': j_frames.css({
                    'marginRight':filmstrip_margin+'px',
                    'marginBottom':opts.frame_gap+'px'
                }); break;
                case 'right': j_frames.css({
                    'marginLeft':filmstrip_margin+'px',
                    'marginBottom':opts.frame_gap+'px'
                }); break;
            }
            $('.img_wrap',j_frames).each(function(i){
                $(this).css({
                    'height':Math.min(opts.frame_height,img_h[i%item_count]*frame_img_scale[i%item_count])+'px',
                    'width':Math.min(opts.frame_width,img_w[i%item_count]*frame_img_scale[i%item_count])+'px',
                    'position':'relative',
                    'top':(opts.show_captions && opts.filmstrip_position=='top'?frame_caption_size:0)+Math.max(0,(opts.frame_height-(frame_img_scale[i%item_count]*img_h[i%item_count]))/2)+'px',
                    'left':Math.max(0,(opts.frame_width-(frame_img_scale[i%item_count]*img_w[i%item_count]))/2)+'px',
                    'overflow':'hidden'
                });
            });
            $('img',j_frames).each(function(i){
                $(this).css({
                    'opacity':opts.frame_opacity,
                    'height':img_h[i%item_count]*frame_img_scale[i%item_count]+'px',
                    'width':img_w[i%item_count]*frame_img_scale[i%item_count]+'px',
                    'position':'relative',
                    'top':Math.min(0,(opts.frame_height-(frame_img_scale[i%item_count]*img_h[i%item_count]))/2)+'px',
                    'left':Math.min(0,(opts.frame_width-(frame_img_scale[i%item_count]*img_w[i%item_count]))/2)+'px'

                }).mouseover(function(){
                        $(this).stop().animate({'opacity':1.0},300);
                    }).mouseout(function(){
                        //Don't fade out current frame on mouseout
                        if(!$(this).parent().parent().hasClass('current')) $(this).stop().animate({'opacity':opts.frame_opacity},300);
                    });
            });
            $('.strip_wrapper',j_gallery).css({
                'position':'absolute',
                'overflow':'hidden'
            });
            if(filmstrip_orientation=='horizontal') {
                $('.strip_wrapper',j_gallery).css({
                    'top':(opts.filmstrip_position=='top'?Math.max(gallery_padding,filmstrip_margin)+'px':opts.panel_height+gallery_padding+'px'),
                    'left':((gallery_width-wrapper_width)/2)+gallery_padding+'px',
                    'width':wrapper_width+'px',
                    'height':strip_height+'px'
                });
            } else {
                $('.strip_wrapper',j_gallery).css({
                    'left':(opts.filmstrip_position=='left'?Math.max(gallery_padding,filmstrip_margin)+'px':opts.panel_width+gallery_padding+'px'),
                    'top':Math.max(gallery_padding,opts.frame_gap)+'px',
                    'width':strip_width+'px',
                    'height':wrapper_height+'px'
                });
            }
            $('.caption',j_gallery).css({
                'position':'absolute',
                'top':(opts.filmstrip_position=='bottom'?f_frame_height:0)+'px',
                'left':'0',
                'margin':'0',
                'width':f_frame_width+'px',
                'padding':'0',
                'height':frame_caption_size+'px',
                'overflow':'hidden',
                'lineHeight':frame_caption_size+'px'
            });
            var pointer = $('<div></div>');
            pointer.addClass('pointer').appendTo(j_gallery).css({
                'position':'absolute',
                'zIndex': opts.zIndex + 1,
                'width':'0px',
                'fontSize':'0px',
                'lineHeight':'0%',
                'borderTopWidth':pointer_height+'px',
                'borderRightWidth':(pointer_width/2)+'px',
                'borderBottomWidth':pointer_height+'px',
                'borderLeftWidth':(pointer_width/2)+'px',
                'borderStyle':'solid'
            });

            //For IE6, use predefined color string in place of transparent (see stylesheet)
            var transColor = $.browser.msie && $.browser.version.substr(0,1)=='6' ? 'pink' : 'transparent'

            if(!opts.show_panels) { pointer.css('borderColor',transColor); }

            switch(opts.filmstrip_position) {
                case 'top': pointer.css({
                    'bottom':(opts.panel_height-(pointer_height*2)+gallery_padding+filmstrip_margin)+'px',
                    'left':((gallery_width-wrapper_width)/2)+(slide_method=='strip'?0:((f_frame_width+opts.frame_gap)*iterator))+((f_frame_width/2)-(pointer_width/2))+gallery_padding+'px',
                    'borderBottomColor':transColor,
                    'borderRightColor':transColor,
                    'borderLeftColor':transColor
                }); break;
                case 'bottom': pointer.css({
                    'top':(opts.panel_height-(pointer_height*2)+gallery_padding+filmstrip_margin)+'px',
                    'left':((gallery_width-wrapper_width)/2)+(slide_method=='strip'?0:((f_frame_width+opts.frame_gap)*iterator))+((f_frame_width/2)-(pointer_width/2))+gallery_padding+'px',
                    'borderTopColor':transColor,
                    'borderRightColor':transColor,
                    'borderLeftColor':transColor
                }); break;
                case 'left': pointer.css({
                    'right':(opts.panel_width-pointer_width+gallery_padding+filmstrip_margin)+'px',
                    'top':(f_frame_height/2)-(pointer_height)+(slide_method=='strip'?0:((f_frame_height+opts.frame_gap)*iterator))+gallery_padding+'px',
                    'borderBottomColor':transColor,
                    'borderRightColor':transColor,
                    'borderTopColor':transColor
                }); break;
                case 'right': pointer.css({
                    'left':(opts.panel_width-pointer_width+gallery_padding+filmstrip_margin)+'px',
                    'top':(f_frame_height/2)-(pointer_height)+(slide_method=='strip'?0:((f_frame_height+opts.frame_gap)*iterator))+gallery_padding+'px',
                    'borderBottomColor':transColor,
                    'borderLeftColor':transColor,
                    'borderTopColor':transColor
                }); break;
            }

            j_pointer = $('.pointer',j_gallery);

            //Add navigation buttons
            var navNext = $('<img />');
            navNext.addClass('nav-next').attr('src',opts.theme_path+opts.nav_theme+'/next.gif').appendTo(j_gallery).css({
                'position':'absolute',
                'cursor':'pointer'
            }).click(showNextItem);
            var navPrev = $('<img />');
            navPrev.addClass('nav-prev').attr('src',opts.theme_path+opts.nav_theme+'/prev.gif').appendTo(j_gallery).css({
                'position':'absolute',
                'cursor':'pointer'
            }).click(showPrevItem);
            if(filmstrip_orientation=='horizontal') {
                navNext.css({
                    'top':(opts.filmstrip_position=='top'?Math.max(gallery_padding,filmstrip_margin):opts.panel_height+filmstrip_margin+gallery_padding)+((f_frame_height-22)/2)+'px',
                    'right':((gallery_width+(gallery_padding*2))/2)-(wrapper_width/2)-opts.frame_gap-22+'px'
                });
                navPrev.css({
                    'top':(opts.filmstrip_position=='top'?Math.max(gallery_padding,filmstrip_margin):opts.panel_height+filmstrip_margin+gallery_padding)+((f_frame_height-22)/2)+'px',
                    'left':((gallery_width+(gallery_padding*2))/2)-(wrapper_width/2)-opts.frame_gap-22+'px'
                });
            } else {
                navNext.css({
                    'left':(opts.filmstrip_position=='left'?Math.max(gallery_padding,filmstrip_margin):opts.panel_width+filmstrip_margin+gallery_padding)+((f_frame_width-22)/2)+13+'px',
                    'top':wrapper_height+(Math.max(gallery_padding,opts.frame_gap)*2)+'px'
                });
                navPrev.css({
                    'left':(opts.filmstrip_position=='left'?Math.max(gallery_padding,filmstrip_margin):opts.panel_width+filmstrip_margin+gallery_padding)+((f_frame_width-22)/2)-13+'px',
                    'top':wrapper_height+(Math.max(gallery_padding,opts.frame_gap)*2)+'px'
                });
            }
        }

        //Check mouse to see if it is within the borders of the panel
        //More reliable than 'mouseover' event when elements overlay the panel
        function mouseIsOverGallery(x,y) {
            var pos = getPos(j_gallery[0]);
            var top = pos.top;
            var left = pos.left;
            return x > left && x < left+gallery_width+(filmstrip_orientation=='horizontal'?(gallery_padding*2):gallery_padding+Math.max(gallery_padding,filmstrip_margin)) && y > top && y < top+gallery_height+(filmstrip_orientation=='vertical'?(gallery_padding*2):gallery_padding+Math.max(gallery_padding,filmstrip_margin));
        }

        function getInt(i) {
            i = parseInt(i,10);
            if(isNaN(i)) { i = 0; }
            return i;
        }

        function buildGallery() {
            var gallery_images = opts.show_filmstrip?$('img',j_frames):$('img',j_panels);
            gallery_images.each(function(i){
                img_h[i] = this.height;
                img_w[i] = this.width;
                if(opts.frame_scale=='nocrop') {
                    frame_img_scale[i] = Math.min(opts.frame_height/img_h[i],opts.frame_width/img_w[i]);
                } else {
                    frame_img_scale[i] = Math.max(opts.frame_height/img_h[i],opts.frame_width/img_w[i]);
                }

                if(opts.panel_scale=='nocrop') {
                    panel_img_scale[i] = Math.min(opts.panel_height/img_h[i],opts.panel_width/img_w[i]);
                } else {
                    panel_img_scale[i] = Math.max(opts.panel_height/img_h[i],opts.panel_width/img_w[i]);
                }
            });

            /************************************************/
            /*	Apply CSS Styles							*/
            /************************************************/
            j_gallery.css({
                'position':'relative',
                'width':gallery_width+(filmstrip_orientation=='horizontal'?(gallery_padding*2):gallery_padding+Math.max(gallery_padding,filmstrip_margin))+'px',
                'height':gallery_height+(filmstrip_orientation=='vertical'?(gallery_padding*2):gallery_padding+Math.max(gallery_padding,filmstrip_margin))+'px'
            });

            /************************************************/
            /*	Build filmstrip and/or panels				*/
            /************************************************/
            if(opts.show_filmstrip) {
                buildFilmstrip();
                enableFrameClicking();
            }
            if(opts.show_panels) {
                buildPanels();
            }

            /************************************************/
            /*	Add events to various elements				*/
            /************************************************/
            if(opts.show_panels && !opts.show_filmstrip && opts.keep_nav_buttons_visible) {
                if(opts.hover_nav_buttons_images) {
                    $('.nav-next-overlay').fadeIn('fast');
                    $('.nav-prev-overlay').fadeIn('fast');
                }
                $('.nav-next',j_gallery).fadeIn('fast');
                $('.nav-prev',j_gallery).fadeIn('fast');
            }
            if(opts.pause_on_hover || (opts.show_panels && !opts.show_filmstrip)) {
                // make actual use of this code since this mousemove wasn't activated
                $(j_gallery).parent().mousemove(function(e){
                    if(mouseIsOverGallery(e.pageX,e.pageY)) {
                        if(opts.pause_on_hover) {
                            if(!paused) {
                                $(document).oneTime(500,"animation_pause",function(){
                                    $(document).stopTime("transition");
                                    paused=true;
                                });
                            }
                        }
                        if(opts.show_panels && !opts.show_filmstrip && !panel_nav_displayed) {

                            if(!opts.keep_nav_buttons_visible){
                                if(opts.hover_nav_buttons_images) {
                                    $('.nav-next-overlay').fadeIn('fast');
                                    $('.nav-prev-overlay').fadeIn('fast');
                                }
                                $('.nav-next',j_gallery).fadeIn('fast');
                                $('.nav-prev',j_gallery).fadeIn('fast');
                            }
                            panel_nav_displayed = true;
                        }
                    } else {
                        if(opts.pause_on_hover) {
                            $(document).stopTime("animation_pause");
                            if(paused) {
                                $(document).everyTime(opts.transition_interval,"transition",function(){
                                    showNextItem();
                                });
                                paused = false;
                            }
                        }
                        if(opts.show_panels && !opts.show_filmstrip && panel_nav_displayed) {
                            if(!opts.keep_nav_buttons_visible){
                                if(opts.hover_nav_buttons_images) {
                                    $('.nav-next-overlay').fadeOut('fast');
                                    $('.nav-prev-overlay').fadeOut('fast');
                                }
                                $('.nav-next',j_gallery).fadeOut('fast');
                                $('.nav-prev',j_gallery).fadeOut('fast');
                            }
                            panel_nav_displayed = false;
                        }
                    }
                });
            }


            /****************************************************************/
            /*	Initiate Automated Animation								*/
            /****************************************************************/

                //Hide loading box
            j_filmstrip.css('visibility','visible');
            j_gallery.css('visibility','visible');
            $('.loader',j_gallery).fadeOut('1000',function(){
                //Show the 'first' panel
                showItem(iterator);
                //If we have more than one item, begin automated transitions
                if(item_count > 1) {
                    $(document).everyTime(opts.transition_interval,"transition",function(){
                        showNextItem();
                    });
                }
            });
        }

        /************************************************/
        /*	Main Plugin Code							*/
        /************************************************/
        return this.each(function() {
            //Hide <ul>
            $(this).css('visibility','hidden');

            //Wrap <ul> in <div> and transfer ID to container <div>
            //Assign filmstrip class to <ul>
            $(this).wrap("<div></div>");
            j_gallery = $(this).parent();
            j_gallery.css('visibility','hidden').attr('id',$(this).attr('id')).addClass('gallery');
            $(this).removeAttr('id').addClass('filmstrip');

            $(document).stopTime("transition");
            $(document).stopTime("animation_pause");

            id = j_gallery.attr('id');

            //If there is no defined panel content, we will scale panel images
            scale_panel_images = $('.panel-content',j_gallery).length==0;

            //Define dimensions of pointer <div>
            pointer_height = opts.pointer_size;
            pointer_width = opts.pointer_size*2;

            //Determine filmstrip orientation (vertical or horizontal)
            //Do not show captions on vertical filmstrips
            filmstrip_orientation = (opts.filmstrip_position=='top'||opts.filmstrip_position=='bottom'?'horizontal':'vertical');
            if(filmstrip_orientation=='vertical') opts.show_captions = false;

            j_filmstrip = $('.filmstrip',j_gallery);
            j_frames = $('li',j_filmstrip);
            j_frames.addClass('frame');

            //If the user wants panels, generate them using the filmstrip images
            if(opts.show_panels) {
                for(i=j_frames.length-1;i>=0;i--) {
                    if(j_frames.eq(i).find('.panel-content').length>0) {
                        j_frames.eq(i).find('.panel-content').remove().prependTo(j_gallery).addClass('panel');
                    } else {
                        p = $('<div>');
                        p.addClass('panel');
                        im = $('<img />');
                        im.attr('src',j_frames.eq(i).find('img').eq(0).attr('src')).appendTo(p);
                        p.prependTo(j_gallery);
                        j_frames.eq(i).find('.panel-overlay').remove().appendTo(p);
                    }
                }
            } else {
                $('.panel-overlay',j_frames).remove();
                $('.panel-content',j_frames).remove();
            }

            //If the user doesn't want a filmstrip, delete it
            if(!opts.show_filmstrip) { j_filmstrip.remove(); }
            else {
                //Wrap the frame images (and links, if applicable) in container divs
                //These divs will handle cropping and zooming of the images
                j_frames.each(function(i){
                    if($(this).find('a').length>0) {
                        $(this).find('a').wrap('<div class="img_wrap"></div>');
                    } else {
                        $(this).find('img').wrap('<div class="img_wrap"></div>');
                    }
                });
                j_frame_img_wrappers = $('.img_wrap',j_frames);
            }

            j_panels = $('.panel',j_gallery);

            if(!opts.show_panels) {
                opts.panel_height = 0;
                opts.panel_width = 0;
            }


            //Determine final frame dimensions, accounting for user-added padding and border
            f_frame_width = opts.frame_width+extraWidth(j_frame_img_wrappers);
            f_frame_height = opts.frame_height+extraHeight(j_frame_img_wrappers);

            //Number of frames in filmstrip
            item_count = opts.show_panels?j_panels.length:j_frames.length;

            //Number of frames that can display within the gallery block
            //64 = width of block for navigation button * 2 + 20
            if(filmstrip_orientation=='horizontal') {
                strip_size = opts.show_panels?Math.floor((opts.panel_width-((opts.frame_gap+22)*2))/(f_frame_width+opts.frame_gap)):Math.min(item_count,opts.filmstrip_size);
            } else {
                strip_size = opts.show_panels?Math.floor((opts.panel_height-(opts.frame_gap+22))/(f_frame_height+opts.frame_gap)):Math.min(item_count,opts.filmstrip_size);
            }

            /************************************************/
            /*	Determine transition method for filmstrip	*/
            /************************************************/
            //If more items than strip size, slide filmstrip
            //Otherwise, slide pointer
            if(strip_size >= item_count) {
                slide_method = 'pointer';
                strip_size = item_count;
            }
            else {slide_method = 'strip';}

            iterator = (strip_size<item_count?item_count:0)+opts.start_frame-1;

            /************************************************/
            /*	Determine dimensions of various elements	*/
            /************************************************/
            filmstrip_margin = (opts.show_panels?getInt(j_filmstrip.css('marginTop')):0);
            j_filmstrip.css('margin','0px');

            if(filmstrip_orientation=='horizontal') {
                //Width of gallery block
                gallery_width = opts.show_panels?opts.panel_width:(strip_size*(f_frame_width+opts.frame_gap))+44+opts.frame_gap;

                //Height of gallery block = screen + filmstrip + captions (optional)
                gallery_height = (opts.show_panels?opts.panel_height:0)+(opts.show_filmstrip?f_frame_height+filmstrip_margin+(opts.show_captions?frame_caption_size:0):0);
            } else {
                //Width of gallery block
                gallery_height = opts.show_panels?opts.panel_height:(strip_size*(f_frame_height+opts.frame_gap))+22;

                //Height of gallery block = screen + filmstrip + captions (optional)
                gallery_width = (opts.show_panels?opts.panel_width:0)+(opts.show_filmstrip?f_frame_width+filmstrip_margin:0);
            }



            //Width of filmstrip
            if(filmstrip_orientation=='horizontal') {
                if(slide_method == 'pointer') {strip_width = (f_frame_width*item_count)+(opts.frame_gap*(item_count));}
                else {strip_width = (f_frame_width*item_count*3)+(opts.frame_gap*(item_count*3));}
            } else {
                strip_width = (f_frame_width+filmstrip_margin);
            }

            if(filmstrip_orientation=='horizontal') {
                strip_height = (f_frame_height+filmstrip_margin+(opts.show_captions?frame_caption_size:0));
            } else {
                if(slide_method == 'pointer') {strip_height = (f_frame_height*item_count+opts.frame_gap*(item_count));}
                else {strip_height = (f_frame_height*item_count*3)+(opts.frame_gap*(item_count*3));}
            }

            //Width of filmstrip wrapper (to hide overflow)
            wrapper_width = ((strip_size*f_frame_width)+((strip_size-1)*opts.frame_gap));
            wrapper_height = ((strip_size*f_frame_height)+((strip_size-1)*opts.frame_gap));


            gallery_padding = getInt(j_gallery.css('paddingTop'));
            j_gallery.css('padding','0px');
            /********************************************************/
            /*	PLACE LOADING BOX OVER GALLERY UNTIL IMAGES LOAD	*/
            /********************************************************/
            galleryPos = getPos(j_gallery[0]);
            $('<div>').addClass('loader').css({
                'position':'absolute',
                'zIndex':'1200',
                'opacity':1,
                'top':'0px',
                'left':'0px',
                'width':gallery_width+(filmstrip_orientation=='horizontal'?(gallery_padding*2):gallery_padding+Math.max(gallery_padding,filmstrip_margin))+'px',
                'height':gallery_height+(filmstrip_orientation=='vertical'?(gallery_padding*2):gallery_padding+Math.max(gallery_padding,filmstrip_margin))+'px'
            }).appendTo(j_gallery);


            if(!window_loaded) {
                $(window).load(function(){
                    window_loaded = true;
                    buildGallery();
                });
            } else {
                buildGallery();
            }

        });
    };

    $.fn.galleryView.defaults = {

        show_panels: true,
        show_filmstrip: true,

        panel_width: 600,
        panel_height: 400,
        frame_width: 60,
        frame_height: 40,

        start_frame: 1,
        filmstrip_size: 3,
        transition_speed: 800,
        transition_interval: 4000,

        overlay_opacity: 0.7,
        frame_opacity: 0.3,

        pointer_size: 8,

        nav_theme: 'dark',
        easing: 'swing',

        filmstrip_position: 'bottom',
        overlay_position: 'bottom',

        panel_scale: 'nocrop',
        frame_scale: 'crop',

        frame_gap: 5,

        show_captions: false,
        fade_panels: true,
        pause_on_hover: false,
        // new options in 2.0.x
        hover_nav_buttons_images: true, // boolean about the display the overlay nav buttons
        // false by default in order to keep current logic
        keep_nav_buttons_visible: false, // boolean to show or hide nav buttons on gallery hover
        theme_path: "../../++resource++galleryview/themes/",
        zIndex: 999
    };

//    promo gallery customization
    $.fn.lofJSlider = function(settings) {
        return this.each(function() {
            return new $.lofSlider(this, settings);
        });
    };
    $.lofSlider = function(obj, settings) {
        this.settings = {
            direction: '',
            mainItemSelector: 'li',
            navInnerSelector: 'ul',
            navSelector: 'li',
            navigatorEvent: 'click', /* click|mouseenter */
            wrapperSelector: '.sliders-wrap-inner',
            wrapperOuter: '.gallery-slider-wrapper',
            interval: 5000,
            auto: false, // whether to automatic play the slideshow
            maxItemDisplay: 3,
            startItem: 0,
            navPosition: 'vertical', /* values: horizontal|vertical*/
            navigatorHeight: 100,
            navigatorWidth: 310,
            duration: 600,
            navItemsSelector: '.navigator-wrap-inner li',
            navOuterSelector: '.navigator-wrapper',
            isPreloaded: true,
            easing: 'easeInOutQuad',
            onPlaySlider: function(obj, slider) {},
            onComplete: function(slider, index) {}
        };
        $.extend(this.settings, settings || {});
        this.nextNo = null;
        this.previousNo = null;
        this.maxWidth = this.settings.mainWidth || 684;

        this.wrapper = $(obj).find(this.settings.wrapperSelector);
        var wrapOuter = $('<div class="gallery-slider-wrapper"></div>').width(this.maxWidth);
        this.wrapper.wrap(wrapOuter);

        this.slides = this.wrapper.find(this.settings.mainItemSelector);
        if (!this.wrapper.length || !this.slides.length) { return; }
        // set width of wrapper
        if (this.settings.maxItemDisplay > this.slides.length) {
            this.settings.maxItemDisplay = this.slides.length;
        }
        this.currentNo = isNaN(this.settings.startItem) || this.settings.startItem > this.slides.length ? 0 : this.settings.startItem;
        this.navigatorOuter = $(obj).find(this.settings.navOuterSelector);
        this.navigatorItems = $(obj).find(this.settings.navItemsSelector);
        this.navigatorInner = this.navigatorOuter.find(this.settings.navInnerSelector);
        // use automatic calculate width of navigator

        if (this.settings.navigatorHeight === null || this.settings.navigatorWidth === null) {
            this.settings.navigatorHeight = this.navigatorItems.eq(0).outerWidth(true);
            this.settings.navigatorWidth = this.navigatorItems.eq(0).outerHeight(true);

        }
        if (this.settings.navPosition === 'horizontal') {
            this.navigatorInner.width(this.slides.length * this.settings.navigatorWidth);
            this.navigatorOuter.width(this.settings.maxItemDisplay * this.settings.navigatorWidth);
            this.navigatorOuter.height(this.settings.navigatorHeight);

        } else {
            this.navigatorInner.height(this.slides.length * this.settings.navigatorHeight);

            this.navigatorOuter.height(this.settings.maxItemDisplay * this.settings.navigatorHeight);
            this.navigatorOuter.width(this.settings.navigatorWidth);
        }
        this.slides.width(this.settings.mainWidth);
        this.navigratorStep = this.__getPositionMode(this.settings.navPosition);
        this.directionMode = this.__getDirectionMode();

        if (this.settings.direction === 'opacity') {
            this.wrapper.addClass('lof-opacity');
            $(this.slides).css({
                'opacity': 0,
                'z-index': 1
            }).eq(this.currentNo).css({
                    'opacity': 1,
                    'z-index': 3
                });
        } else {
            this.wrapper.css({
                'left': '-' + this.currentNo * this.maxSize + 'px',
                'width': (this.maxWidth) * this.slides.length
            });
        }

        if (this.settings.isPreloaded) {
            this.preLoadImage(this.onComplete);
        } else {
            this.onComplete();
        }

        var $buttonControl = $(".gallery-slider-controls", obj);
        if (this.settings.auto) {
            $buttonControl.addClass("action-stop");
        } else {
            $buttonControl.addClass("action-start");
        }
        var self = this;

        $(obj).hover(function() {
            self.stop();
            $buttonControl.addClass("action-start").removeClass("action-stop").addClass("hover-stop");
        }, function() {
            if ($buttonControl.hasClass("hover-stop")) {

                if (self.settings.auto) {
                    $buttonControl.removeClass("action-start").removeClass("hover-stop").addClass("action-stop");
                    self.play(self.settings.interval, 'next', true);
                }
            }
        });

        $buttonControl.click(function(e) {
            if ($buttonControl.hasClass("action-start")) {
                self.settings.auto = true;
                self.play(self.settings.interval, 'next', true);
                $buttonControl.removeClass("action-start").addClass("action-stop");
            } else {
                self.settings.auto = false;
                self.stop();
                $buttonControl.addClass("action-start").removeClass("action-stop");
            }
            e.preventDefault();
        });
    };
    $.lofSlider.fn = $.lofSlider.prototype;
    $.lofSlider.fn.extend = $.lofSlider.extend = $.extend;

    $.lofSlider.fn.extend({

        startUp: function(obj, wrapper) {
            var self = this;

            this.navigatorItems.each(function(index, item) {
                $(item).bind(self.settings.navigatorEvent, function() {
                    self.jumping(index, true);
                    self.setNavActive(index, item);
                });
                $(item).css({
                    'height': self.settings.navigatorHeight,
                    'width': self.settings.navigatorWidth
                });
            });
            this.setNavActive(this.currentNo);
            this.settings.onComplete(this.slides.eq(this.currentNo), this.currentNo);
            if (this.settings.buttons && typeof(this.settings.buttons) === "object") {
                this.registerButtonsControl('click', this.settings.buttons, this);

            }
            if (this.settings.auto) { this.play(this.settings.interval, 'next', true); }

            return this;
        },
        onComplete: function() {
            setTimeout(function() {
                $('.preload').fadeOut(900, function() {
                    $('.preload').remove();
                });
            }, 400);
            this.startUp();
        },
        preLoadImage: function(callback) {
            var self = this;
            var images = this.wrapper.find('img');

            var count = 0;
            images.each(function(index, image) {
                if (!image.complete) {
                    image.onload = function() {
                        count++;
                        if (count >= images.length) {
                            self.onComplete();
                        }
                    };
                    image.onerror = function() {
                        count++;
                        if (count >= images.length) {
                            self.onComplete();
                        }
                    };
                } else {
                    count++;
                    if (count >= images.length) {
                        self.onComplete();
                    }
                }
            });
        },
        navigationAnimate: function(currentIndex) {
            if (currentIndex <= this.settings.startItem || currentIndex - this.settings.startItem >= this.settings.maxItemDisplay - 1) {
                this.settings.startItem = currentIndex - this.settings.maxItemDisplay + 2;
                if (this.settings.startItem < 0) { this.settings.startItem = 0; }
                if (this.settings.startItem > this.slides.length - this.settings.maxItemDisplay) {
                    this.settings.startItem = this.slides.length - this.settings.maxItemDisplay;
                }
            }

            this.navigatorInner.stop().animate(eval('({' + this.navigratorStep[0] + ':-' + this.settings.startItem * this.navigratorStep[1] + '})'), {
                duration: 500,
                easing: 'easeInOutQuad'
            });
        },
        setNavActive: function(index, item) {
            if ((this.navigatorItems)) {
                this.navigatorItems.removeClass('active');
                $(this.navigatorItems.get(index)).addClass('active');
                this.navigationAnimate(this.currentNo);
            }
        },
        __getPositionMode: function(position) {
            if (position === 'horizontal') {
                return ['left', this.settings.navigatorWidth];
            }
            return ['top', this.settings.navigatorHeight];
        },
        __getDirectionMode: function() {
            switch (this.settings.direction) {
                case 'opacity':
                    this.maxSize = 0;
                    return ['opacity', 'opacity'];
                default:
                    this.maxSize = this.maxWidth;
                    return ['left', 'width'];
            }
        },
        registerButtonsControl: function(eventHandler, objects, self) {
            function next(e) {
                self.next(true);
                e.preventDefault();
            }
            function previous(e) {
                self.next(true);
                e.preventDefault();
            }
            for (var action in objects) {
                if (objects.hasOwnProperty(action)) {
                    switch (action.toString()) {
                        case 'next':
                            objects[action].click(next);
                            break;
                        case 'previous':
                            objects[action].click(previous);
                            break;
                    }
                }
            }
            return this;
        },
        onProcessing: function(manual, start, end) {
            this.previousNo = this.currentNo + (this.currentNo > 0 ? -1 : this.slides.length - 1);
            this.nextNo = this.currentNo + (this.currentNo < this.slides.length - 1 ? 1 : 1 - this.slides.length);
            return this;
        },
        finishFx: function(manual) {
            if (manual) { this.stop(); }
            if (manual && this.settings.auto) {
                this.play(this.settings.interval, 'next', true);
            }
            this.setNavActive(this.currentNo);
            this.settings.onPlaySlider(this, $(this.slides).eq(this.currentNo));
        },
        getObjectDirection: function(start, end) {
            return eval("({'" + this.directionMode[0] + "':-" + (this.currentNo * start) + "})");
        },
        fxStart: function(index, obj, currentObj) {
            var s = this;
            if (this.settings.direction === 'opacity') {

                $(this.slides).stop().animate({
                    opacity: 0
                }, {
                    duration: this.settings.duration,
                    easing: this.settings.easing,
                    complete: function() {
                        s.slides.css("z-index", "1");
                        s.slides.eq(index).css("z-index", "3");
                    }
                });
                $(this.slides).eq(index).stop().animate({
                    opacity: 1
                }, {
                    duration: this.settings.duration,
                    easing: this.settings.easing,
                    complete: function() {
                        s.settings.onComplete($(s.slides).eq(index), index);
                    }
                });
            } else {
                this.wrapper.stop().animate(obj, {
                    duration: this.settings.duration,
                    easing: this.settings.easing,
                    complete: function() {
                        s.settings.onComplete($(s.slides).eq(index), index);
                    }
                });
            }
            return this;
        },
        jumping: function(no, manual) {
            this.stop();
            if (this.currentNo === no) { return; }
            var obj = eval("({'" + this.directionMode[0] + "':-" + (this.maxSize * no) + "})");
            this.onProcessing(null, manual, 0, this.maxSize)
                .fxStart(no, obj, this)
                .finishFx(manual);
            this.currentNo = no;
        },
        next: function(manual, item) {

            this.currentNo += (this.currentNo < this.slides.length - 1) ? 1 : (1 - this.slides.length);
            this.onProcessing(item, manual, 0, this.maxSize)
                .fxStart(this.currentNo, this.getObjectDirection(this.maxSize), this)
                .finishFx(manual);
        },
        previous: function(manual, item) {
            this.currentNo += this.currentNo > 0 ? -1 : this.slides.length - 1;
            this.onProcessing(item, manual)
                .fxStart(this.currentNo, this.getObjectDirection(this.maxSize), this)
                .finishFx(manual);
        },
        play: function(delay, direction, wait) {
            this.stop();
            if (!wait) {
                this[direction](false);
            }
            var self = this;
            this.isRun = setTimeout(function() {
                self[direction](true);
            }, delay);
        },
        stop: function() {
            if (this.isRun === null) { return; }
            clearTimeout(this.isRun);
            this.isRun = null;
        }
    });

})(jQuery);

