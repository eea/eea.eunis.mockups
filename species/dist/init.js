(function($) {
    $(function() {

        // Species slider gallery
        var buttons = {
            previous : $('.gallery-slider-controls .button-prev'),
            next     : $('.gallery-slider-controls .button-next')
        };

        $('.gallery-slider').lofJSliderNews(
            {
                interval        : 10000,
                direction		: 'slide', // use 'opacity' if you want items to fade
                easing			: 'easeInOutQuad',
                duration		: 1200,
                opacityClass    : 'lof-opacity',
                auto            : true,
                buttons			: buttons,
                mainWidth       : 475,
                wrapperSelector  : '.gallery-slider-wrapper-inner',
                toggleElement   : '#dummy'

            }
        );

        // table definition dropdown
        $('.table-definition-target').click(function () { showDefinition(this);});

        // overlay helper from plone
        $('.threat-status-cr').find('a').prepOverlay({
            subtype: 'iframe'
        });
        var $content = $("#content");

        $("a").filter("[rel]").each(function () {

            if (!$content.find(this.rel).hasClass('overlay')) {
                return;
            }
            $(this).overlay({
                // common configuration for each overlay
                oneInstance: false,
                closeOnClick: true,
                top: 260,
                onBeforeLoad: function (e) {
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


})(jQuery);
