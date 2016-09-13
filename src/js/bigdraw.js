(function (root,$) {
    var vars = root.vars;

    var bigdraw ={};
    /* index */
    bigdraw.index ={
        init: function () {
            $(function () {
                FastClick.attach(document.body);

                MtaH5.clickStat('1'); //
                var f=vars.getParam('f')||'';
                if(f=='qr'){
                    MtaH5.clickStat('qr');
                }else{
                    if(vars.IsWeixinBrowser){
                        MtaH5.clickStat('weixin');
                    }else if(vars.IsAndroid){
                        MtaH5.clickStat('android');
                    }else if(vars.IsIOS){
                        MtaH5.clickStat('ios');
                    }else{
                        MtaH5.clickStat('other');
                    }
                }

                $('.btn1').on('click', function () {
                    MtaH5.clickStat('c1');
                    setTimeout(function () {
                         location.href = "create.html";
                    },250);

                });

                window.initShareEvents();

            });
        }
    };

    /* create */
    bigdraw.create ={
        init:function () {
            var self = this;
            $(function () {
                FastClick.attach(document.body);
                MtaH5.clickStat('2');
                self.evens();
                window.initShareEvents();
            });
        },
        evens:function () {

            $('#sin').on('click', function () {
                var slc=$(this).attr('data-sin');
                $(this).attr('class','sin sin'+slc);
                $('#tin').attr('class','tin p'+slc);
                $('#tin').show();

            });

            $('.ys-opts .ys').on('click', function () {
                var me =this;
                var ys = $('.ys');
                $('#tin').hide();
                $('.dl-rlt').hide();
                var slc = $(this).attr('data-sin');
                var tips = $('#sin');

                $('#ys-choice').attr('class','ys-choice co'+slc);

                $.each(ys, function (i, v) {
                    if(v==me){
                        $(me).addClass('current');
                     }else{
                        $(v).removeClass('current');
                     }
                 });

                var sinClass=['sin' , 'sin'+slc , 'sin'+slc+'-tips','flipInCardY'].join(' ');
                tips.attr('class',sinClass);
                tips.attr('data-sin',slc);
                tips.one(
                    'webkitAnimationEnd ' +
                    'mozAnimationEnd ' +
                    'MSAnimationEnd ' +
                    'oanimationend ' +
                    'animationend ',
                    function(){
                        $(this).removeClass('flipInCardY');
                    });

            });

            $(document.body).on('cvsImageData',function(evt,kind, bx64 ){
                bx64 = bx64 ||  vars.getLocalStorage('cvsImageData');
                kind = kind ||  vars.getLocalStorage('cvsImageKind');
                root.draw.upload(kind,bx64,function (rt) {
                    rt=rt||{};
                    console.log("upload rt ",JSON.stringify(rt));
                    var data = rt && rt.data || "";
                    var cbUrl= '';
                    if(data && data.url) {
                        cbUrl = data.url || '';
                    }
                    vars.setLocalStorage('cvsImageUrl',cbUrl);
                    $('#sin').hide();
                    $('#tin').hide();

                     setTimeout(function () {
                        location.href = "rlt.html?kind=" +kind+"&url="+ cbUrl;
                     },100);
                });
            });

            $('.btn2').on('click', function () {
                var sin = $('#sin').attr('data-sin')||3;
                var wd  = $('#sin_input').val()||'';
                if(wd) {
                    MtaH5.clickStat('c2');
                    if (wd.length > 10) {
                        wd = wd.substring(1,10);
                    }
                    MtaH5.clickStat('y'+3);
                    draw.drawCanvas(wd, sin); //make photo
                }
            });

            var checkCountChar = function () {
                var txtAre =  $("#sin_input");
                var x = txtAre.val().length;
                if (x >=10) {
                    vars.showTip('\u6700\u591a\u0031\u0030\u4e2a\u5b57\u7b26',1000);
                }
                return x;
            };

            $("#sin_input").on('change keyup',function (e) {
                  checkCountChar();
            });

        }

    };

    bigdraw.rlt = {
        init: function () {
            var self = this;
            $(function () {
                FastClick.attach(document.body);
                MtaH5.clickStat('3');
                self.events();
                setTimeout( function () {
                    var imgdata = vars.getLocalStorage('cvsImageData')||'';
                    var imgUrl  = vars.getLocalStorage('cvsImageUrl')|| vars.getParam('url') || imgdata;
                    var kind    = vars.getLocalStorage('cvsImageKind')|| vars.getParam('kind') || 3;
                    var dlPic = $('#dl-pic');
                    dlPic.attr('src',imgUrl);
                    dlPic.removeClass().addClass('dl-pic dl-c'+kind);
                    var indexpage = location.href;
                    indexpage = indexpage.replace('rlt.html','index.html');
                    window.initShareEvents();
                },250);
            });
        },
        events:function () {
            $('.btn3').on('click', function () {
                MtaH5.clickStat('c3');
                location.href = "index.html";
            });

        }
    };

    bigdraw.parseToUnicodes = function(contents) {
        contents = contents || '';
        return contents.replace(/[\u4E00-\u9FFF\uF900-\uFAFF]/g,function(character){
            return "\\u" + character.charCodeAt(0).toString(16);
        });
    };

 root.bigdraw = bigdraw;
}(window,window.jQuery || window.Zepto ));

