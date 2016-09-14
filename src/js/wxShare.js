/**
 *   @author: guoqingzhou
 */
;(function(window) {
    "use strict";
    var wxShare = function (shareData) {

        var isWx = !! (window['WeixinJSBridge'] || /MicroMessenger/i.test(window.navigator.userAgent));
        if (!isWx){
            console.log('use wxShare 请用微信客户端打开');
            return 0;
        }

        window.getShareData = function(data) {
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
            var meta  =   getMetaData();
            data = data ? data : meta;
            var rlt = {
                'appid': '',
                'img_url': data['image']||meta['og:image']||'http://shouji.sogou.com/sapp/bigdraw/img/share-logo.jpg',
                'img_width': '150',
                'img_height': '150',
                'link':data['url']||meta['og:url']|| location.href,
                'desc':data['desc']|| meta['og:desc']||meta['description']||'也许这是朋友圈最震撼的玩!',
                'title':data['title']||meta['og:title']|| '朋友圈大字'
            };
            return rlt;
        };

        window.wxShareData = window.getShareData(shareData);

        // ==============================
        var shareContent = {
            title: wxShareData.title || document.title,
            desc: wxShareData.desc || '',
            link: wxShareData.link|| wxShareData.url || location.href,
            imgUrl: wxShareData.imgUrl ||wxShareData.img_url || '',
            type: wxShareData.type || '',
            dataUrl: wxShareData.dataUrl || ''
        };
        //config
        var _config = {
            debug: false,
            url:window.location.href.replace(window.location.hash,''),
            signature:'',
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideOptionMenu',
                'showOptionMenu'
            ]
        };

        // ==============================
        window.wxJsVerify = function(res) {
            if(typeof(wx) !='undefined' && res && res.signature && res.appId){
                _config.appId=res.appId;
                _config.timestamp=res.timestamp;
                _config.nonceStr=res.nonceStr;
                _config.signature=res.signature;
                console.log("接口返回验证签名",res);
                wx.config(_config);
                // 分享接口
                wx.ready(function() {
                    wx.showOptionMenu();
                    wx.onMenuShareTimeline(shareContent);
                    wx.onMenuShareAppMessage(shareContent);
                    wx.onMenuShareQQ(shareContent);
                    wx.onMenuShareWeibo(shareContent);
                });

            }else{
                if(typeof(wx) =='undefined'){
                    console.log('未加载文件 http://res.wx.qq.com/open/js/jweixin-1.1.0.js');
                }else{
                    console.log('服务端验证签名错误');
                }
                if(typeof(WeixinJSBridge) !='undefined' ) {
                    WeixinJSBridge.on('menu:share:timeline', function (argv) {
                        WeixinJSBridge.invoke('shareTimeline', window.wxShareData, function (res) {
                        });
                    });
                    WeixinJSBridge.on('menu:share:appmessage', function (argv) {
                        WeixinJSBridge.invoke('sendAppMessage', window.wxShareData, function (res) {
                        });
                    });
                }
            }
        };

        (function() {
            var hp = ('https:' === document.location.protocol) ? 'https://' : 'http://';
            var s = document.createElement('script');
            var ajaxUrl = hp +'m.tv.sohu.com/wxauth/jsticket/signature?callback=wxJsVerify&url=' + _config.url+"&_rd="+ (new Date().getTime()); //or wxJsVerify
            console.log(ajaxUrl);
            s.src = ajaxUrl;
            document.body.appendChild(s);
        })();

    };
    window.wxShare = wxShare;
    window.initShareEvents = wxShare;

}(window));
