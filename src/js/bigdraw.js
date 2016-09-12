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
                $('.dl-rlt').hide();
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
                $('#tin').hide();
                $('.dl-rlt').hide();
                var slc = $(this).attr('data-sin');
                var tips = $('#sin');
                var sinClass=['sin' , 'sin'+slc , 'sin'+slc+'-tips'].join(' ');
                tips.attr('class',sinClass);
                tips.attr('data-sin',slc);
                tips.show();
                console.log(slc)
            });

            $(document.body).on('cvsImageData',function(evt,kind, bx64 ){
                bx64 = bx64 ||  vars.getLocalStorage('cvsImageData');
                root.draw.upload(kind,bx64,function (data) {
                    var orgUrl = data.url || bx64;
                    var cbUrl = data.url || '';
                    vars.setLocalStorage('cvsImageUrl',cbUrl);
                    $('#sin').hide();
                    $('#tin').hide();
                    $('.dl-rlt').show();
                    $('.dl-pic').attr('src',orgUrl);
                    // var _timer = setTimeout(function () {
                        location.href = "rlt.html?url="+ cbUrl;
                    // },0);
                });
            });

            $('.btn2').on('click', function () {
                var sin = $('#sin').attr('data-sin');
                var wd  = $('#sin_input').val();
                draw.drawCanvas(wd,sin); //make img
            });
        }
    };

    bigdraw.rlt = {
        init: function () {
            var self = this;
            $(function () {
                FastClick.attach(document.body);
                var imgdata = vars.getLocalStorage('cvsImageData')|| vars.getParam('url')||'';
                var imgUrl  = vars.getLocalStorage('cvsImageUrl')|| imgdata;
                $('.dl-pic').attr('src',imgUrl);
                self.events();
                window.initShareEvents({
                    'img_url': imgUrl,
                    'img_width': '100',
                    'img_height': '100',
                    'link': location.href,
                    'desc': meta['og:desc']||'',
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

