/*!
 * Social utility functions.
 */
(function($){

    var linkEncoder = 'http://m.avlink.it/';
    var _avSocial = {};

    if (typeof window.avSocial !== 'undefined') {
        _avSocial = window.avSocial;
    }

    /*var simplify_big_number = function(number) {
        if(!number) {
            return '0';
        }
        var output = [],
            sNumber = number.toString();

        if( sNumber.length > 4 ) {
            for (var i = 0, len = sNumber.length; i < len - 3; i += 1) {
                output.push(+sNumber.charAt(i));
            }
            output.push("k");
        } else if( sNumber.length > 3 ) {
            for (var i = 0, len = sNumber.length; i < len - 2; i += 1) {
                if( i == len - 3) {
                    output.push(".");
                }
                output.push(+sNumber.charAt(i));
            }
            output.push("k");
        } else {
            for (var i = 0, len = sNumber.length; i < len; i += 1) {
                output.push(+sNumber.charAt(i));
            }
        }
        return output;
    };

    var activeCounters = 0;
    var canSubmit = false; // Forced.
    var total = 0;
    var stats = {
        shares: {},
        postId: _avSocial? _avSocial.postId : null
    };
    
    var submitShareCounts = function() {
        if (!statsTimeout) return;
        clearTimeout(statsTimeout);
        statsTimeout = null;

        var time = new Date().getTime();
        var expireTime = Date.parse(_avSocial.statsExpire);
        // Send only if required
        if ( total > _avSocial.statsCount && time > expireTime ) {
            var ajaxParams = {
                url: _avSocial.ajaxurl,
                data: {
                    stats: stats,
                    action: 'count_shares',
                    nonce: _avSocial.nonce
                },
                method: 'post',
                success: function(res){
                    if (res == 'KO'){
                        console.error("Warning, error sending social stats.");
                        console.dir(ajaxParams.data);
                    }
                }
            };
            $.ajax(ajaxParams);
        }
    };

    var statsTimeout = setTimeout(function(){
        activeCounters = 0; // timeout occurred, send if required!
        if (canSubmit){
            submitShareCounts();
        }
    }, 1000 * 20);

    var countShares = function(countElement, social){
        var successCount = function(response){
            countElement.html(simplify_big_number(response[social.countProp]));
            var count = response[social.countProp] || 0;
            stats.shares[social.name] = count;
            total += count;
            activeCounters--;
            if (activeCounters == 0 && canSubmit){
                submitShareCounts();
            }
        };

        // Custom behaviour for google.
        if (social.name == 'googleplus'){
            var data = {
                "method":"pos.plusones.get",
                "id": window.location.href,
                "params":{
                    "nolog":true,
                    "id": _avSocial.url || window.location.href,
                    "source":"widget",
                    "userId":"@viewer",
                    "groupId":"@self"
                },
                "jsonrpc":"2.0",
                "key":"p",
                "apiVersion":"v1"
            };
            $.ajax({
                type: "POST",
                url: "https://clients6.google.com/rpc",
                processData: true,
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(r){
                    successCount({ count: r.result.metadata.globalCounts.count});
                }
            });
            return;
        }

        var ajaxParams = {
            url: social.url,
            jsonp: "callback",
            dataType: "jsonp",
            success: successCount
        };

        if (social.data){
            ajaxParams.data = social.data;
        }

        $.ajax(ajaxParams);
    };*/

    var socialData = [{
            clazz: 'av-facebook', // (partial) class in CSS
            url: "https://graph.facebook.com/" + encodeURI(window.location.href), // share count service
            countProp: 'shares', // share count return property
            share: { // share Analytics event
                evtName: 'Facebook', // Name of event
                popup: { h: 320 } // Popup to open when possible
            }
        },{
            clazz: 'av-googleplus',
            countProp: 'count',
            share: {
                evtName: 'GooglePlus',
                popup: { h: 480, w: 680 }
            }
        },{
            clazz: 'av-linkedin',
            url: "http://www.linkedin.com/countserv/count/share",
            data: { url: window.location.href },
            countProp: 'count',
            share: { // NOTE: doesn't work with "official" style.
                evtName: 'LinkedIn',
                popup: { h: 480 }
            }
        },{
            clazz: 'av-pinterest',
            url: "http://api.pinterest.com/v1/urls/count.json",
            data: { url: window.location.href },
            countProp: 'count',
            share: {
                evtName: 'Pinterest',
                popup: { h: screen.height, w: 800 }
            }
        },{
            clazz: 'av-stumbleupon',
            share: { // NOTE: doesn't work with "official" style.
                evtName: 'StumbleUpon',
                popup: { h: 768, w: 1024 }
            }
        },{
            clazz: 'av-twitter',
            share: { // NOTE: doesn't work with "official" style.
                evtName: 'Twitter',
                popup: { h: 253 }
            }
        },{
            clazz: 'av-whatsapp',
            share: {
                evtName: 'Whatsapp',
                callback: function(params){
                    $.ajax({
                        url: linkEncoder + 'add.php',
                        method: 'POST',
                        data: {
                            url: decodeURIComponent(params.data.avUrl)
                        },
                        dataType: 'json',
                        timeout: 5000
                    }).done(function(data){
                        if (data.hash){
                            window.location.href = 'whatsapp://send?text=' + params.data.avTitle + encodeURIComponent(linkEncoder + data.hash + ' ');
                        }else{
                            window.location.href = params.evtLabel;
                        }
                    }).fail(function(data){
                        window.location.href = params.evtLabel;
                    });
                }
            }
        }, {
            clazz: 'av-telegram',
            share: {
                evtName: 'Telegram',
                callback: function (params) {
                    $.ajax({
                        url: linkEncoder + 'add.php',
                        method: 'POST',
                        data: {
                            url: decodeURIComponent(params.data.avUrl)
                        },
                        dataType: 'json',
                        timeout: 5000
                    }).done(function (data) {
                        if (data.hash) {
                            window.location.href = 'tg://msg?text=' + params.data.avTitle + encodeURIComponent(linkEncoder + data.hash + ' ');
                        } else {
                            window.location.href = params.evtLabel;
                        }
                    }).fail(function (data) {
                        window.location.href = params.evtLabel;
                    });
                }
            }
        }
    ];

    var container = $('#container');
    if (container.length == 0){
        container = $(document.body);
    }

    /*// Send as many requests as needed.
    var requests = [];
    for (var i = 0; i < socialData.length; i++){
        socialData[i].name = socialData[i].clazz.substr(3);
        if (socialData[i].countProp) {
            var clazz = '.' + socialData[i].clazz;
            var el = container.find(clazz);
            if (!el.length){
                el = container.find(clazz + '-official');
            }
            // We need to account all requests first
            if (el.length) {
                activeCounters++;
                requests.push([el.find('.av-social-count'), socialData[i]]);
            }
        }
    }

    // Then call them.
    for (i = 0; i < requests.length; i++) {
        var req = requests[i];
        countShares(req[0], req[1]);
    } */
    
    $.fn.extend({
       avAddShareTrackingEvents: function(){
           $(this).find('.av-social-btn.av-share-btn').on('click', function(e){
               var el = $(this);
               var clazz = el.attr('class');
               var aEl = $(this).find('a');
               var url = aEl.attr('href');
               var data = aEl.data();
               // If on an official buttons, don't open our popup window.
               var evtAction = 'Share';

               for (var i = 0; i<socialData.length; i++) {
                   var sd = socialData[i];

                   if (clazz.indexOf(sd.clazz) >= 0) {
                       // We can now submit (if required).
                       /*if (sd.countProp) {
                           canSubmit = false;
                           if (activeCounters == 0){
                               submitShareCounts();
                           }
                       }*/

                       var openPopup = ! el.hasClass(sd.clazz + '-official') || sd.share.evtName == 'Facebook';
                       var callAfterEvt = ! openPopup;

                       var cb = !sd.share.callback && openPopup ?
                           function(params){
                                $.fn.avOpenWindow(params.evtLabel, params.evtName, sd.share.popup.h, sd.share.popup.w);
                            }
                           : sd.share.callback;
                       if (!url){
                           url = $(this).find('[data-url]').attr('data-url');
                       }
                       var params = {
                           evtCategory: sd.share.evtName,
                           evtAction: evtAction,
                           evtLabel: url,
                           data: data
                       };
                       $.fn.avTrackEvent(params, cb, callAfterEvt);
                       break;
                   }
               }
               if (openPopup){
                   e.stopPropagation();
                   return false;
               }
               return true;
           });
       }
    });

    container.avAddShareTrackingEvents();

}(jQuery));