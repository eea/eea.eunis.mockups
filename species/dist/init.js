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
            var position = $(this).offset();
            $(this).overlay({
                // common configuration for each overlay
                oneInstance: false,
                closeOnClick: true,
                // setup custom finish position
                onBeforeLoad: function (e) {
                    this.getOverlay().animate({top: e.clientY, left: e.clientX}, 500);
                },
                top: position.top,
                left: position.left
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
