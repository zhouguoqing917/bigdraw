/**
 *   @author: guoqingzhou
 *   微信分享Lite版
 */
;(function(window) {
    "use strict";
    window.getShareData =function(data) {
        var getMetaData = function () {
            //解析meta data
            var o = document.getElementsByTagName("meta");
            var rlt = {};
            for (var i = 0; i < o.length; i++) {
                var vn = o[i].getAttribute('name');
                var vp = o[i].getAttribute('property');
                var vl = o[i].getAttribute('content') || "";
                if (vn == null || vn == undefined || vn.length == 0) {
                    vn = vp;
                }
                if (vn == null || vn == undefined || vn.length == 0) {
                    continue;
                }
                rlt[vn] = vl;
            }
            return rlt;
        };
        var meta = data || getMetaData();
        var shareData = {
            'appid': '',
            'img_url': meta['og:image']||'../photo/share.png',
            'img_width': '100',
            'img_height': '100',
            'link':meta['og:url']|| location.href,
            'desc': meta['og:desc']||'现在朋友圈流行这样装逼',
            'title':meta['og:title']|| '朋友圈大字'
        };
        return shareData;
    };

    window.initShareEvents =function (data) {
        window.shareData = window.getShareData(data);
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
