/**
 *   @author: guoqingzhou
 *   微信分享Lite版
 */
;(function(window) {
    "use strict";

    window.initShareEvents =function (data) {
        var shareData = window.shareData = {
            'appid': '',
            'img_url': 'http://shouji.sogou.com/sapp/bigdraw/img/share-logo.jpg',
            'img_width': '150',
            'img_height': '150',
            'link': location.href,
            'desc':'也许这是朋友圈最震撼的玩法！',
            'title': '朋友圈大字'
        };
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.on('menu:share:timeline', function (argv) {//分享到朋友圈
                WeixinJSBridge.invoke('shareTimeline', window.shareData, function (res) {
                });
            });
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {//分享给朋友
                WeixinJSBridge.invoke('sendAppMessage', window.shareData, function (res) {
                });
            });
        }, false);
    }

}(window));
