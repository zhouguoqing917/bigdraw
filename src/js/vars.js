 !function ($,global) {
    'use strict';
    var vars = {};
    var emptyFn = function () {};
    vars.getParam = function (a, b) {
        var c, d, e;
        return"undefined" == typeof b ? (d = window.location.href, c = new RegExp("(^|&?)" + a + "=([^&]*)(&|$)", "i")) :
            (d = a, c = new RegExp("(^|&?)" + b + "=([^&]*)(&|$)", "i")), e = d.match(c), null !== e
            ? decodeURIComponent(e[2]) : '';
    };
    vars.getHost = function () {
        var _host = window.location.hostname || window.location.host,
            _sarray = location.host.split(".");
        if (_sarray.length > 1) {
            _host = _sarray.slice(_sarray.length - 2).join(".");
        }
        return _host;
    };
    vars.setParam = function (url, name, val) {
        try {
            if (typeof url !== 'undefined' && typeof name !== 'undefined' && typeof val !== 'undefined') {
                val = encodeURIComponent(val);
                if (url.indexOf('?') === -1) {
                    url += '?' + name + '=' + val;

                } else {
                    var urlParamArr = url.split('?');
                    var pStr = urlParamArr[1];
                    var pArr = pStr.split('&');
                    var findFlag = false;

                    $.each(pArr, function (index, item) {
                        var paramArr = item.split('=');

                        if (name === paramArr[0]) {
                            findFlag = true;
                            pArr[index] = name + '=' + val;

                            return false;
                        }
                    });

                    if (!findFlag) {
                        url += '&' + name + '=' + val;

                    } else {
                        url = urlParamArr[0] + '?' + pArr.join('&');
                    }
                }
            }

        } catch (e) {
            typeof console !== 'undefined' && typeof console.log === 'function' && console.log(e);
        }

        return url;
    };

    /**
     * @memberOf URL
     * @summary ��ָ��url����Ӷ������
     * @type {function}
     * @param {string} url                      - ָ��url����
     * @param {string|object} param             - Ϊstringʱ,param��ʾkey��param2��־value; objectʱ������param2��������������������ӵ�url��
     * @param {string} param2                   - ��paramΪstringʱ��Ч����־value
     * @return {string}
     */
    vars.setParams = function (url, param, param2) {
        //ֻ���1������
        if (typeof param === 'string' && typeof param2 !== 'undefined') {
            return vars.setParam(url, param, param2);
            //��Ӷ������
        } else if (typeof param === 'object') {
            for (var i in param) {
                url = vars.setParam(url, i, param[i]);
            }
            return url;
        } else {
            return url;
        }
    };

    vars.getQueryData = function (queryString) {
        queryString = queryString.replace(/^\?+/, '').replace(/&amp;/, '&');
        var querys = queryString.split('&'),
            i = 0,
            _URLParms = {},
            item;
        try {
            while (i < querys.length) {
                item = querys[i].split('=');
                if (item[0]) {
                    var value = item[1] || '';
                    try {
                        value = decodeURIComponent(value);
                    } catch (e) {
                        value = unescape(value);
                    }
                    value = (value === 'null') ? null : value;
                    _URLParms[decodeURIComponent(item[0])] = value;
                }
                i++;
            }
        } catch (e) {
            console.log(e)
        }

        return _URLParms;
    };

    vars.objToQueryString = function (obj) {
        var result = [],
            key, value;
        try {
            for (key in obj) {
                value = obj[key];
                var clz = Object.prototype.toString.call(value);

                if (clz === '[object Array]') {
                    result.push(key + '=' + JSON.stringify(value));

                } else if (clz === '[object Object]') {
                    result.push(key + '=' + JSON.stringify(value));

                } else {
                    result.push(key + '=' + encodeURIComponent('undefined' === typeof value ? '' : value));
                }
            }
        } catch (e) {
            console.log(e)
        }

        return result.join('&');
    };
    vars.UA = window.navigator.userAgent;
    vars.IsSohuVideoClient = (/SohuVideoPad/i.test(vars.UA) || /SohuVideoMobile/i.test(vars.UA) || vars.getParam('clientType') && vars.getParam('clientVer')) ? true : false;
    vars.IsAndroid = !!(/Android|HTC|Adr/i.test(vars.UA) || !!(window.navigator.platform + '').match(/Linux/i));
    vars.IsIpad = !vars.IsAndroid && /iPad/i.test(vars.UA);
    vars.IsIpod = !vars.IsAndroid && /iPod/i.test(vars.UA);
    vars.IsIphone = !vars.IsAndroid && /iPod|iPhone/i.test(vars.UA);
    vars.IsIOS = vars.IsIpad || vars.IsIphone;
    vars.IsWindowsPhone = /Windows\sPhone|Windows\sPhone\s([1234567]\.|8\.0)/i.test(vars.UA);
    vars.IsWindowsPad = /Windows\sPad/i.test(vars.UA);
    vars.IsWindows = /Windows/i.test(vars.UA);
    vars.AdrPadRegex = /pad|XiaoMi\/MiPad|lepad|YOGA|MediaPad|GT-P|SM-T|GT-N5100|sch-i800|HUAWEI\s?[MTS]\d+-\w+|Nexus\s7|Nexus\s8|Nexus\s11|Kindle Fire HD|Tablet|tab/i;
    /**
     * @memberof VARS
     * @summary �豸��Ļ�����ܶ�
     * @type {number}
     */
    vars.PixelRatio = function () {
        var ratio = 1;
        try {
            if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
                ratio = window.screen.systemXDPI / window.screen.logicalXDPI;
            } else if (window.devicePixelRatio !== undefined) {
                ratio = window.devicePixelRatio;
            } else {
                ratio = window.devicePixelRatio;
            }
            ratio = parseFloat(ratio) || 1;
        } catch (e) {
        }
        return ratio;
    }();
    /**
     * @memberof VARS
     * @summary �Ƿ���androd pad
     * @type {boolean}
     */
    vars.IsAndroidPad = function () {
        //��׿pad����
        var padScreen = 1;
        var _IsAndroidPad = false;
        var ScreenSizeCorrect = 1;
        if (vars.IsAndroid) {
            if ((window['screen']['width'] / window['innerWidth']).toFixed(2) === vars.PixelRatio.toFixed(2)) {
                ScreenSizeCorrect = 1 / vars.PixelRatio;
            }
        }
        var _ratio = ScreenSizeCorrect || 1;
        //����
        var sw = Math.floor(window.screen.width * _ratio);
        var sh = Math.floor(window.screen.height * _ratio);
        var inch = 1;
        try {
            //�Խ��߳��ȴ���
            padScreen = parseFloat(Math.sqrt(sw * sw + sh * sh));
            //�ߴ�
            inch = parseFloat(padScreen / (160 * vars.PixelRatio));
        } catch (e) {
        }
        // �Խ��߳��ȴ���1280 ��ΪPad
        if (!!('ontouchstart' in window) && vars.IsAndroid) {
            var adrPad = !!(vars.AdrPadRegex.test(vars.UA));

            if (/mobile/i.test(vars.UA) && !adrPad ) {
                _IsAndroidPad = false;

            } else {

                if (adrPad &&  !/coolpad/i.test(vars.UA) ) {
                    _IsAndroidPad = true;
                } else {
                    // �Խ��߳��ȴ��� 2500 ,inch > 7.0  ��ΪPad
                    if (!_IsAndroidPad && (padScreen >= 2500 || inch > 7.0)) {
                        _IsAndroidPad = true;
                    }
                }
            }
        }
        return _IsAndroidPad;
    }();

    vars.ActionProtocol = 'sohuvideo' + (vars.IsIpad ? 'hd' : '') + '://';
    vars.openTime = vars.IsIOS ? 800 : 1000;
    vars.IsWeixinBrowser = !!(window['WeixinJSBridge'] || /MicroMessenger/i.test(vars.UA));

    vars.ENABLE_DEBUG = false;//alert ����

    vars.setCookie = function (name, value, expire, domain) {
        var expires = '';
        if (0 !== expire) {
            var t = new Date();
            t.setTime(t.getTime() + (expire || 24) * 3600000);
            expires = ';expires=' + t.toGMTString();
        }
        var s = escape(name) + '=' + escape(value) + expires + ';path=/' + (domain ? (';domain=' + domain) : '');
        document.cookie = s;

        return true;
    };

    /**
     * @memberof Cookie
     * @summary ��ȡָ����Cookie
     * @type {function}
     * @param {String} name Ҫ��ȡ��Cookie����
     * @return {String} ��Ӧ��Cookieֵ����������ڣ�����{null}
     */
    vars.getCookie = function (name) {
        var arrCookie = document.cookie.split(';'),
            arrS;
        for (var i = 0; i < arrCookie.length; i++) {
            var item = arrCookie[i];
            var index = item.indexOf('=');
            var cName = item.substr(0, index);
            var cValue = item.substr(index + 1);
            if (cName.trim() === name) {
                return unescape(cValue);
            }
        }
        return '';
    };
    vars.evalJSON = function (src) {
        var obj = {};
        try {
            obj = JSON.parse(src);
        } catch (e) {
            try {

                if (typeof JSON === 'object' && JSON.parse) {
                    obj = eval('[' + src + ']')[0];

                } else {
                    obj = eval('(' + src + ')');
                }

            } catch (b) {
                console.log(b);
                obj = null;
            }
        }
        return obj;
    };
    vars.serialize = function (value) {
        return JSON.stringify(value);
    };

    /**
     * @memberof Util
     * @summary ��json�ַ���ת����json����
     * @type {function}
     * @return {string}                        - uuid
     */
    vars.JSONParse = function (src) {
        var obj = {};

        try {

            if (/\\%/.test(src)) {
                src = decodeURIComponent(src);
            }

            if (typeof (JSON) === 'object' && JSON.parse) {
                obj = eval('[' + src + ']')[0];

            } else {
                obj = eval('(' + src + ')');
            }

        } catch (e) {

            try {

                if (/\\%/.test(src)) {
                    src = decodeURIComponent(src);
                }
                obj = JSON.parse(src);

            } catch (b) {
                typeof console !== 'undefined' && typeof console.log === 'function' && console.log(b);
            }
        }

        return obj;
    };

    /**
     * @memberof Util
     * @summary ��json����ת����json�ַ���
     * @type {function}
     * @return {string}                        - uuid
     */
    vars.JSONStringify = function (obj) {
        var rst = '';
        var arr = [];

        if (typeof JSON === 'object' && typeof JSON.stringify === 'function') {
            rst = JSON.stringify(obj);

        } else {

            if (typeof obj === 'undefined' || typeof obj === 'string' || obj === null) {
                rst = '"' + obj + '"';

            } else if (typeof obj === 'number' || typeof obj === 'boolean') {
                rst = obj;
            //object
            } else {

                if (obj instanceof RegExp) {
                    rst = '"' + obj.toString() + '"';

                } else if (obj instanceof Date) {
                    rst = '"' + obj.toUTCString() + '"';

                } else if (obj instanceof Error) {
                    rst = '{}';

                } else if (obj instanceof Array) {

                $.each(obj, function (index, item) {
                    arr.push(JSONStringify(item));
                });
                rst = '[' + arr.join(',') + ']';

                } else if (typeof obj !== 'function') {

                    $.each(obj, function (index, item) {
                        arr.push('"' + index + '":' + JSONStringify(item));
                    });
                    rst = '{' + arr.join(',') + '}';
                }
            //functionֱ������
            }
        }

        return rst;
    };

    /**
     * @memberof Cookie
     * @summary ����sessionStorage
     * @type {function}
     * @param {string} name                             - ��������
     * @param {string} value                            - ����ֵ
     */
    vars.setSession = function (name, value) {
        try {
            if (!!window.sessionStorage) {
                window.sessionStorage.setItem(name, vars.serialize(value));
            }
        } catch (e) {
            vars.setCookie(name, vars.serialize(value), 24);
        }
    };

    /**
     * @memberof Cookie
     * @summary ��ȡsessionStorage
     * @type {function}
     * @param {string} name                             - ��������
     * @return {string}
     */
    vars.getSession = function (name) {
        var sRet = '';
        try {
            if (!!window.sessionStorage) {
                sRet = vars.JSONParse(window.sessionStorage.getItem(name));
            }
        } catch (e) {
            sRet = vars.JSONParse(vars.getCookie(name));
        }
        return sRet;
    };

     vars.getLocalStorage = function (name) {
         var sRet = '';
         try {
             if (!!window.localStorage) {
                 sRet = vars.JSONParse(window.localStorage.getItem(name));
             }
         } catch (e) {
             sRet = vars.JSONParse(vars.getCookie(name));
         }
         return sRet;
     };

     vars.setLocalStorage = function (name, value) {
         try {
             if (!!window.localStorage) {
                 window.localStorage.setItem(name, vars.serialize(value));
             }
         } catch (e) {
             vars.setCookie(name, vars.serialize(value), 24);
         }
     };

    vars.imgPingback = function(url, callbak) {
        if (!url) {
            return;
        }
        try {
            var _date = new Date().getTime();
            var pingbackURLs = url.split('|'), i = 0, l = pingbackURLs.length;
            for (; i < l; i++) {
                (new Image()).src = pingbackURLs[i];
            }
            if (typeof callbak === 'function') {
                callbak();
            }
        }catch(e){console.log(e)}
    };

    vars.PingCCback = function(cc, cb) {
        var a = "",
            n = "",
            i = "",
            h = window.screen,
            cc = cc || "";

        vars.IsIOS ? (a = "ios", vars.IsIpad ? n = "ipad": vars.IsIphone && (n = "iphone")) : vars.IsAndroid ? n = a = "android": vars.IsWindowsPhone
            && (n = a = "windowsphone"),
            i = h.width + "x" + h.height;
        var t = document.cookie.match(/SUV=([0-9]+)/);t && (t = t[1]);
        var paramaString = ["t=", +new Date, "&uid=", t || "", "&position=",cc, "&op=click", "&details=", "&nid=",
                "&url=", encodeURIComponent(location.href), "&screen=", i, "&os=", a, "&platform=", n, "&passport="].join("");
        var _url="http://z.m.tv.sohu.com/h5_cc.gif?" + paramaString;
        vars.imgPingback(_url,cb);

    };

    vars.loadScript = function(url, callback,cbOpts) {
        var head = document.getElementsByTagName('head')[0] || document.body,
            script = document.createElement('script'),
            done = false;
        script.src = url;
        script.onload = script.onreadystatechange = function() {
            if (!done && (!this.readyState || this.readyState !== 'loading')) {
                done = true;
                if (callback) callback.apply(null, cbOpts || []);
                script.onload = script.onreadystatechange = null;
                head.removeChild(script);
            }
        };
        head.appendChild(script);
    };

     /**
      *   �ֻ�����ʾ��ʾ����
      *   tip.showTip(
      *   text,    //���أ���ʾ�ı�����
      *   milliSec //���ɣ�milliSec������Զ��ر���ʾ����
      *   );
      */
     var Tip = {
         params: {
             $nodes: {
                 $container: $('body')
             },
             classes: {
                 tipMask: 'tip-mask',
                 tipWrapper: 'tip-wrapper',
                 tipContent: 'tip-content'
             },
             clickType: 'click',
             isTouch: 'ontouchstart' in window
         }, 
         event: {
             closeTip: function () {
                 var self = Tip, params = self.params, $tipMask = params.$nodes.$tipMask;
                 if (self.timer) {
                     clearTimeout(self.timer);
                     self.timer = null;
                 }
                 if (params.isTouch) {
                     $tipMask.off('touchmove');
                 }
                 $tipMask.remove();
             },
             preventTouchMove: function (e) {
                 e.preventDefault();
             }
         },
         initTip: function (text) {
             var self = this;
             self.renderTip(text);
             self.initEvents();
         },
         renderTip: function (text) {
             var self = this, params = self.params, classes = params.classes, html = '';
             html += '<div class="' + classes.tipMask + '">';
             html += '<div class="' + classes.tipWrapper + '" style="visibility:hidden;">';
             html += '<div class="' + classes.tipContent + '">' + text + '</div>';
             html += '</div>';
             html += '</div>';
             params.$nodes.$container.append(html);
             self.getNodes();
             self.setTipWrapperPosition();
         },
         setTipWrapperPosition: function () {
             var $tipWrapper = this.params.$nodes.$tipWrapper;
             $tipWrapper.css({'visibility': 'visible', 'margin-top': '-' + $tipWrapper.height() / 2 + 'px'});
         },
         getNodes: function () {
             var self = this;
             self.params.$nodes.$tipMask = $('.' + self.params.classes.tipMask);
             self.params.$nodes.$tipWrapper = $('.' + self.params.classes.tipWrapper);
         },
         showTip: function (text, milliSec) {
             var self = this;
             milliSec = milliSec || 0;
             self.initTip(text);
             if (typeof milliSec === 'number' && milliSec > 0) {
                 if (self.timer) {
                     clearTimeout(self.timer);
                     self.timer = null;
                 }
                 self.timer = setTimeout(function () {
                     self.event.closeTip();
                 }, milliSec);
             }
         },
         initEvents: function () {
             var self = this, params = self.params, $tipMask = params.$nodes.$tipMask;
             $tipMask.one(params.clickType, self.event.closeTip);
             if (params.isTouch) {
                 $tipMask.on('touchmove', self.event.preventTouchMove);
             }
         }
     };

     vars.showTip =function (text, milliSec) {
         Tip.showTip.apply(Tip, arguments);
     };

  global.vars = vars;

}(window.Zepto || window.jQuery, window);
