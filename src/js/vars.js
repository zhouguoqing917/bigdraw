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
     * @summary 向指定url中添加多个参数
     * @type {function}
     * @param {string} url                      - 指定url链接
     * @param {string|object} param             - 为string时,param表示key，param2标志value; object时，忽略param2，将对象中所有属性添加到url中
     * @param {string} param2                   - 当param为string时生效，标志value
     * @return {string}
     */
    vars.setParams = function (url, param, param2) {
        //只添加1个参数
        if (typeof param === 'string' && typeof param2 !== 'undefined') {
            return vars.setParam(url, param, param2);
            //添加多个参数
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
     * @summary 设备屏幕象素密度
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
     * @summary 是否是androd pad
     * @type {boolean}
     */
    vars.IsAndroidPad = function () {
        //安卓pad正则
        var padScreen = 1;
        var _IsAndroidPad = false;
        var ScreenSizeCorrect = 1;
        if (vars.IsAndroid) {
            if ((window['screen']['width'] / window['innerWidth']).toFixed(2) === vars.PixelRatio.toFixed(2)) {
                ScreenSizeCorrect = 1 / vars.PixelRatio;
            }
        }
        var _ratio = ScreenSizeCorrect || 1;
        //像素
        var sw = Math.floor(window.screen.width * _ratio);
        var sh = Math.floor(window.screen.height * _ratio);
        var inch = 1;
        try {
            //对角线长度大于
            padScreen = parseFloat(Math.sqrt(sw * sw + sh * sh));
            //尺寸
            inch = parseFloat(padScreen / (160 * vars.PixelRatio));
        } catch (e) {
        }
        // 对角线长度大于1280 则为Pad
        if (!!('ontouchstart' in window) && vars.IsAndroid) {
            var adrPad = !!(vars.AdrPadRegex.test(vars.UA));

            if (/mobile/i.test(vars.UA) && !adrPad ) {
                _IsAndroidPad = false;

            } else {

                if (adrPad &&  !/coolpad/i.test(vars.UA) ) {
                    _IsAndroidPad = true;
                } else {
                    // 对角线长度大于 2500 ,inch > 7.0  则为Pad
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

    vars.ENABLE_DEBUG = false;//alert 开关

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
     * @summary 读取指定的Cookie
     * @type {function}
     * @param {String} name 要获取的Cookie名称
     * @return {String} 对应的Cookie值，如果不存在，返回{null}
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
     * @summary 将json字符串转换成json对象
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
     * @summary 将json对象转换成json字符串
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
            //function直接无视
            }
        }

        return rst;
    };

    /**
     * @memberof Cookie
     * @summary 设置sessionStorage
     * @type {function}
     * @param {string} name                             - 参数名称
     * @param {string} value                            - 参数值
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
     * @summary 获取sessionStorage
     * @type {function}
     * @param {string} name                             - 参数名称
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

  global.vars = vars;

}(window.Zepto || window.jQuery, window);
