(function($) {
    $(function() {

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
    });

})(jQuery);


