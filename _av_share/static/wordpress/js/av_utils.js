/*!
 * av_utils.js utility functions.
 */
(function($){
    $.fn.extend({
        avTrackEvent: function (params, callback, callAfterEvent) {

            var eventCategory = params.evtCategory;
            var eventAction = params.evtAction;
            var eventLabel = params.evtLabel;

            var _gaq = window._gaq || window.parent._gaq;
            var ga = window.ga || window.parent.ga;

            var typeCb = typeof callback;
            var to = null;

            var cb = function (callMe) {
                if (callMe && typeCb == 'function') {
                    callback(params);
                }
            };

            if (callAfterEvent) {
                to = setTimeout(cb, 2500);
            }

            try {
                if (typeof _gaq == 'object') {
                    _gaq.push(['_set', 'hitCallback', function () {
                        cb(callAfterEvent);
                    }], ['_trackEvent', eventCategory, eventAction, eventLabel]);
                } else if (typeof ga == 'function') {
                    ga('send', {
                        'hitType': 'event',
                        'eventCategory': eventCategory,
                        'eventAction': eventAction,
                        'eventLabel': eventLabel,
                        'hitCallback': function () {
                            cb(callAfterEvent);
                        }
                    });
                }

                if (!callAfterEvent) { // Call if a callback was defined
                    cb(!callAfterEvent);
                }

            } catch (e) {
                if (to) clearTimeout(to);
                console.warn(e);
            }
        },

        avOpenWindow: function (url, name, height, width) {

            var sw = screen.width;
            var sh = screen.height;

            if (!width || width < 0 || width > sw) width = 600;
            if (!height || height < 0 || height > sh) height = 400;

            if (width > sw) width = sw;
            if (height > sh) height = sh;
            window.open(url, 'social_' + name, 'width=' + width + ',height=' + height + ',left=' + ((sw - width) >> 1) + ',top=' + ((sh - height) >> 1));
        }
    });
}(jQuery));
