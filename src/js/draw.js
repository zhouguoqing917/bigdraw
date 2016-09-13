(function (root,$) {
    var vars = root.vars;
    var draw =  root.draw = {};
    //var uploadUrl = 'http://'+location.host+'/nodejs/uploadBase64Data';
    var uploadUrl ='http://'+location.host+'/sapp/bigdraw/savepic.php';

    var data={
         kind:3,
         keywd:"",
         image:[
              "img/c1.png",  //kind=1
              "img/c2.png",  //kind=2
              "img/c3.png",  //kind=3
              "img/c4.png"   //kind=4
        ],
        imageList:[],
        qrImage:"img/qr.png" //qrcode img
    };
    draw.base64 =[];
    draw.drawCanvas = function (keywd,sin){
        console.log( keywd);
        var base64 = root.draw.base64;
        var kind = data.kind = sin ||3;
        data.keywd = keywd || data.keywd;
        var p = parseInt(data.kind)-1;
        p = p>3?3:p<0?0:p;

        data.imageList[0] =  data.image[p]||"img/c3.png";
        data.imageList[1] = data.qrImage;

        var cvs =document.createElement("canvas"),
            ct = cvs.getContext("2d"),
            len =  data.imageList.length;
        if(kind ==1){
            cvs.width =288; //px
            cvs.height=193;
        }else if(kind == 2) {
            cvs.width =272; //px
            cvs.height=298;
        }else if(kind == 3) {
            cvs.width =398; //px
            cvs.height=640;
        }else {
            cvs.width =600; //px
            cvs.height=454;
        }

        ct.rect(0,0,cvs.width,cvs.height);
        ct.fillStyle='#fff';
        ct.fill();

        function drawText(text,kind) {
            //text = text.replace(/[\s]/g,"");
            //相对于画布
            var tpos={
                1:{ x1:52,y1:59, x2:52,y2:112,m:46,s:44 ,c:'#000000'},
                2:{ x1:38,y1:118, x2:38,y2:176,m:46,s:44 ,c:'#000000'},
                3:{ x1:245,y1:334, x2:151,y2:334,m:64,s:62,c:'#000000' },
                4:{ x1:320,y1:185, x2:320,y2:272,m:54,s:52,c:'#000000'}
            };

            var fillText = function (txt,kk) {
                kk=kk||3;
                var obj=tpos[kk]||{};
                var mx=5;
                var x1 = obj.x1||245;
                var y1 = obj.y1||334;
                var x2 = obj.x2||151;
                var y2 = obj.y2||334;
                var m = obj.m||64;
                var s = obj.s||62;
                var c = obj.c||'#000000';
                var txtarr = txt.split('')||[];
                var x =  x1;
                var y =  y1;
                for(var i=0;i<txtarr.length;i++) {

                    if(i>=10) { break;}
                    var char = txtarr[i];
                    if(i == mx) {
                        //换行
                        x= x2;
                        y= y2;
                    }
                    ct.font='' +s+'px arial,sans-serif ';
                    ct.fillStyle = c||'#C13E2C';
                    ct.textAlign = 'center';
                    ct.fillText(char,x, y);
                    if(kk==3) {
                        y += m; //竖排
                    }

                    if(kk==1 || kk==2 ||kk==4 ) {
                        x+= m; //横排
                    }
                }

            };

            //context.fillText(text,x,y,maxWidth);
            // ct.fillText('.',235+ct.measureText(text).width,60);

            fillText(text,kind);
            return ct;
        }

        function drawQrcode(pic,kk) {
            kk = kk||3;
            var w=50,h=50;
            var ppos={
                1:{ x1:204,y1:130 },
                2:{ x1:200,y1:227 },
                3:{ x1:320,y1:557 },
                4:{ x1:270,y1:388 }
            };
            var p =ppos[kk]||{};
            var x =p.x1;
            var y =p.y1;
            ct.drawImage(pic, x, y, w, h);
            return ct;
        }

        function drawImg(n,kind){
            if(n<len){
                var img=new Image();
                img.crossOrigin = 'Anonymous'; //解决跨域
                img.src = data.imageList[n];

                img.onerror = function(){
                    console.log('draw photo load err');
                    drawImg(n+1,kind);
                };
                img.onload=function(){
                    if(n == len-1){
                        drawQrcode(this,kind);
                    }else {
                        ct.drawImage(this, 0, 0, cvs.width, cvs.height);
                    }
                    drawImg(n+1,kind);
                }
            }else{
                drawText(data.keywd,kind);
                base64.push(cvs.toDataURL("image/jpeg"));
                vars.setLocalStorage('cvsImageData', base64[0]);
                vars.setLocalStorage('cvsImageKind',kind);
                $(document.body).trigger('cvsImageData',[kind,base64[0]]);

            }
        }
        drawImg(0,data.kind)
    };

    draw.upload = function (kind,base64Data,callback) {
        var xUrl = uploadUrl;
        var submitData={
            dosubmit:true,
            pic:base64Data,
            kind:kind,
            hostname:location.host
        };

        $.ajax({
            data: submitData,
            url: xUrl,
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (cbData) {
                callback && callback(cbData);
            },
            error: function (rst) {
                callback && callback(rst);
            }
        });
    };

}(window,window.jQuery || window.Zepto ));

