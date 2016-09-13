(function (root,$) {
    var vars = root.vars;
    var bigdraw ={};
    /* index */
    bigdraw.index ={
        init: function () {
            $(function () {
                FastClick.attach(document.body);
                $('.btn1').on('click', function () {
                    location.href = "create.html";
                });
            });
        }
    };

    /* create */
    bigdraw.create ={
        init:function () {
            var self = this;
            $(function () {
                FastClick.attach(document.body);

                self.evens();

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

                var sinClass=['sin' , 'sin'+slc , 'sin'+slc+'-tips','animated','flipInCardY'].join(' ');
                tips.attr('data-sin',slc);
                tips.attr('class',sinClass).one(
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
                    console.log("upload rt ",rt);
                    var data = rt && rt.data || "";
                    var cbUrl= bx64;
                    if(data && data.url) {
                        cbUrl = data.url || bx64;
                    }
                    vars.setLocalStorage('cvsImageUrl',cbUrl);
                    $('#sin').hide();
                    $('#tin').hide();

                    // var _timer = setTimeout(function () {

                        location.href = "rlt.html?kind=" +kind+"&url="+ cbUrl;

                    // },0);
                });
            });

            $('.btn2').on('click', function () {
                var sin = $('#sin').attr('data-sin');
                var wd  = $('#sin_input').val()||'';
                if(wd) {
                    if (wd.length > 10) {
                        wd = wd.substring(1,10);
                    }
                    draw.drawCanvas(wd, sin); //make photo
                }
            });

            var checkCountChar = function () {
                var txtAre =  $("#sin_input");
                var x = txtAre.val().length;
                if (x >=10) {
                    vars.showTip('最多输入10个字符',1000);
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
                var imgdata = vars.getLocalStorage('cvsImageData')||'';
                var imgUrl  = vars.getLocalStorage('cvsImageUrl')|| vars.getParam('url') || imgdata;
                var kind    = vars.getLocalStorage('cvsImageKind')|| vars.getParam('kind') || 3;
                var dlPic = $('#dl-pic');
                dlPic.attr('src',imgUrl);
                dlPic.removeClass().addClass('dl-pic dl-c'+kind);
                self.events();
                var indexpage = location.href;
                indexpage = indexpage.replace('rlt.html','index.html');
                window.initShareEvents({
                    'img_url': imgUrl,
                    'img_width': '100',
                    'img_height': '100',
                    'link': indexpage,
                    'desc': '现在朋友圈流行这样装逼',
                    'title':  '朋友圈大字'
                } );
            });
        },
        events:function () {
            $('.btn3').on('click', function () {
                location.href = "index.html";
            });

        }
    };

 root.bigdraw = bigdraw;
}(window,window.jQuery || window.Zepto ));

