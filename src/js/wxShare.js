/**
 *   @author: guoqingzhou
 *   ΢�ŷ���Lite��
 */
;(function(window) {
    "use strict";

    window.initShareEvents =function (data) {
        var shareData = window.shareData = {
            'appid': '',
            'img_url': 'img/share-logo.jpg',
            'img_width': '150',
            'img_height': '150',
            'link': location.href,
            'desc':'Ҳ����������Ȧ���𺳵��淨��',
            'title': '����Ȧ����'
        };
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
