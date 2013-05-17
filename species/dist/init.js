(function($) {
    $(function() {

        // Species slider gallery
        var buttons = {
            previous : $('.gallery-slider-controls .button-prev'),
            next     : $('.gallery-slider-controls .button-prev')
        };

        $('.gallery-slider').lofJSidernews(
            {
                interval        : 4000,
                direction		: 'opacity',
                easing			: 'easeOutBounce',
                duration		: 1200,
                opacityClass    : 'lof-opacity',
                auto            : 'true',
                buttons			: buttons,
                wapperSelector  : '.gallery-slider-wrap-inner',
                toggleElement   : '#dummy'

            }
        );

        // table definition dropdown
        $('.table-definition-target').click(function () { showDefinition(this);});

        // overlay helper from plone
        $('.threat-status-cr').find('a').prepOverlay({
            subtype: 'iframe'
        });

        // normal jquerytools overlay which checked the rel attribute for overlay
        // id to open on click
        $('.threat-status-vu').find('a').overlay();

    });

    function showDefinition(context) {
        var $context = $(context);
        if (!$context.hasClass('opened')) {
            $context.parent().find('.table-definition-body').slideDown();
            $context.addClass('opened');
        }
        else {
            $context.parent().find('.table-definition-body').slideUp();
            $context.removeClass('opened');
        }
    }


})(jQuery);
