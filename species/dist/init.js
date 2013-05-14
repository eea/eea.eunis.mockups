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
                auto            : false,
                buttons			: buttons,
                wapperSelector  : '.gallery-slider-wrap-inner',
                toggleElement   : '#content'

            }
        );
    });
})(jQuery);
