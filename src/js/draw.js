(function (root,$) {
    var vars = root.vars;
    var draw =  root.draw = {};
    var uploadUrl = '/nodejs/uploadBase64Data';
    // var uploadUrl = '/sapp/bigdraw/savepic.php';

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
            cvs.width =452; //px
            cvs.height=303;
        }else if(kind == 2) {
            cvs.width =326; //px
            cvs.height=367;
        }else if(kind == 3) {
            cvs.width =222; //px
            cvs.height=357;
        }else {
            cvs.width =464; //px
            cvs.height=351;
        }

        ct.rect(0,0,cvs.width,cvs.height);
        ct.fillStyle='#fff';
        ct.fill();

        function drawText(text,kind) {
            //text = text.replace(/[\s]/g,"");
            //相对于画布
            var tpos={
                1:{ x1:100,y1:125, x2:100,y2:200,m:46,s:44 ,c:'#000000'},
                2:{ x1:35,y1:125, x2:35,y2:200,m:44,s:42 ,c:'#C13E2C'},
                3:{ x1:135,y1:158, x2:84,y2:158,m:30,s:28,c:'#C13E2C' },
                4:{ x1:220,y1:140, x2:220,y2:198,m:38,s:36,c:'#000000'}
            };

            var fillText = function (txt,kk) {
                kk=kk||3;
                var obj=tpos[kk]||{};
                var mx=5;
                var x1 = obj.x1||135;
                var y1 = obj.y1||158;
                var x2 = obj.x2||84;
                var y2 = obj.y2||158;
                var m = obj.m||30;
                var s = obj.s||28;
                var c = obj.c||'#C13E2C';
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
                    if(kk==3) {
                        y += m; //竖排
                    }

                    if(kk==1 || kk==2 ||kk==4 ) {
                        x+= m; //横排
                    }
                    ct.font='bold ' +s+'px arial,sans-serif ';
                    ct.fillStyle = c||'#C13E2C';
                    ct.textAlign = 'center';
                    ct.fillText(char,x, y);
                }

            };

            //context.fillText(text,x,y,maxWidth);
            // ct.fillText('.',235+ct.measureText(text).width,60);

            fillText(text,kind);
            return ct;
        }

        function drawQrcode(pic,kk) {
            kk = kk||3;
            var w=60,h=60;
            var ppos={
                1:{ x1:384,y1:233 },
                2:{ x1:260,y1:302 },
                3:{ x1:158,y1:296 },
                4:{ x1:196,y1:292 }
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
            imgData:base64Data,
            kind:kind,
            hostname:location.hostname
        };
        // var submitData={
        //     dosubmit:true,
        //     pic:base64Data,
        //     kind:kind
        // };
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

