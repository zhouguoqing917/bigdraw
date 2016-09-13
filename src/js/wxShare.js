/**
 *   @author: guoqingzhou
 *   ΢�ŷ���Lite��
 */
;(function(window) {
    "use strict";
    window.getShareData =function(data) {
        var getMetaData = function () {
            //����meta data
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
            'img_url': meta['og:image']||meta['img_url']||'',
            'img_width': '100',
            'img_height': '100',
            'link':meta['og:url']||meta['link']|| location.href,
            'desc': meta['og:desc']||meta['desc']||'��������Ȧ��������װ��',
            'title':meta['og:title']||meta['title']|| '����Ȧ����'
        };
        return shareData;
    };

    window.initShareEvents =function (data) {
        window.shareData = window.getShareData(data);
        document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
            WeixinJSBridge.on('menu:share:timeline', function (argv) {//��������Ȧ
                WeixinJSBridge.invoke('shareTimeline', window.shareData, function (res) {
                });
            });
            WeixinJSBridge.on('menu:share:appmessage', function (argv) {//���������
                WeixinJSBridge.invoke('sendAppMessage', window.shareData, function (res) {
                });
            });
        }, false);
    }

}(window));
