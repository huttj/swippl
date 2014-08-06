;(function($) {
    var delay = 0;
    $.fn.translate3d = function(translations, speed, easing, complete) {
        var opt = $.speed(speed, easing, complete);
        opt.easing = opt.easing || 'ease';
        if(translations instanceof Array) {
            while (translations.length < 4) {
                translations.push(0);
            }
        } else {
            translations = [0,0,0,0];
        }

        return this.each(function() {
            var $this = $(this);

            $this.css({
                transitionDuration: opt.duration + 'ms',
                transitionTimingFunction: opt.easing,
                transform: 'translate3d(' + translations[0] + 'px, ' + translations[1] + 'px, ' + translations[2] + 'px) rotate(' + translations[3] + 'deg)'
            });

            setTimeout(function() {
                $this.css({
                    transitionDuration: '0s',
                    transitionTimingFunction: 'ease'
                });

                opt.complete.call($this);
            }, opt.duration + (delay || 0));
        });
    };
})(jQuery);

// Original:
//
//;(function($) {
//    var delay = 0;
//    $.fn.translate3d = function(translations, speed, easing, complete) {
//        var opt = $.speed(speed, easing, complete);
//        opt.easing = opt.easing || 'ease';
//        translations = $.extend({x: 0, y: 0, z: 0}, translations);
//
//        return this.each(function() {
//            var $this = $(this);
//
//            $this.css({
//                transitionDuration: opt.duration + 'ms',
//                transitionTimingFunction: opt.easing,
//                transform: 'translate3d(' + translations.x + 'px, ' + translations.y + 'px, ' + translations.z + 'px)'
//            });
//
//            setTimeout(function() {
//                $this.css({
//                    transitionDuration: '0s',
//                    transitionTimingFunction: 'ease'
//                });
//
//                opt.complete();
//            }, opt.duration + (delay || 0));
//        });
//    };
//})(jQuery);