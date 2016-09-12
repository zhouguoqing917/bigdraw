(function (root,$) {
    var vars = root.vars;
    var draw =  root.draw = {};
    var uploadUrl = 'http://127.0.0.1/nodejs/upload/base64Data';

    var data={
         kind:3,
         keywd:"杨路好娘",
         image:[
              "img/c1.jpg",  //kind=1
              "img/c2.jpg",  //kind=2
              "img/c3.jpg",  //kind=3
              "img/c4.jpg"   //kind=4
        ],
        imageList:[],
        qrImage:"img/cm.jpg"
    };
    draw.base64 =[];
    draw.drawCanvas = function (keywd,sin){
        console.log( keywd);
        var base64 = root.draw.base64;
        data.kind = sin ||3;
        data.keywd = keywd || data.keywd;
        var p = parseInt(data.kind)-1;
        p = p>3?3:p<0?0:p;

        data.imageList[0] =  data.image[p]||"img/c3.jpg";
        data.imageList[1] = data.qrImage;

        var cvs =document.createElement("canvas"),
            ct = cvs.getContext("2d"),
            len =  data.imageList.length;
        cvs.width =464; //px
        cvs.height=367;
        ct.rect(0,0,cvs.width,cvs.height);
        ct.fillStyle='#fff';
        ct.fill();

        function drawText(text,kind) {
            //text = text.replace(/[\s]/g,"");
            //相对于画布
            fillText = function (txt,x,y,fsz,color) {
                fsz =fsz||24;
                ct.font='bold ' +fsz+'px arial,sans-serif ';
                ct.fillStyle = color||'#C13E2C';
                ct.textAlign = 'center';
                ct.fillText(txt,x, y,367);
            };
            var txt1 = [];
            var x=124,y=220;
           //context.fillText(text,x,y,maxWidth);

            if(kind==1) {
                x = 240;
                y = 150;
                if (text.length > 5) {
                    txt1[0] = text.substring(0, 5);
                    txt1[1] = text.substring(5);
                    fillText(txt1[0], x, y,32,'#000000');
                    fillText(txt1[1], x, y + 60,32,'#000000');
                } else {
                    fillText(text, x, y,32,'#000000');
                }
            }else if(kind==2) {
                    x = 240;
                    y = 150;
                    if (text.length > 5) {
                        txt1[0] = text.substring(0,5);
                        txt1[1] = text.substring(5);
                        fillText(txt1[0],x,y,32,'#000000');
                        fillText(txt1[1],x,y+60,32,'#000000');
                    }else{
                        fillText(text,x,y,32,'#000000');
                    }
            }else if(kind==3) {
                x=124;
                y=220;
                if (text.length > 5) {
                    txt1[0] = text.substring(0,5);
                    txt1[1] = text.substring(5);
                    fillText(txt1[0],x,y,26,'#C13E2C');
                    fillText(txt1[1],x,y+40,26,'#C13E2C');
                }else{
                    fillText(text,x,y,26,'#C13E2C');
                }
            }else if(kind==4) {
                x = 320;
                y = 160;
                if (text.length > 5) {
                    txt1[0] = text.substring(0,5);
                    txt1[1] = text.substring(5);
                    fillText(txt1[0],x,y,42,'#000000');
                    fillText(txt1[1],x,y+40,42,'#000000');
                }else{
                    fillText(text,x,y,42,'#000000');
                }
            }else {
                fillText(text,x,y);
            }
            // ct.fillText('.',235+ct.measureText(text).width,60);
            return ct;
        }
        function drawQrcode(pic,kind) {
            var x=400,y=300,w=50,h=50;
            if(kind==1) {
                x =394; y = 233;
            }else if(kind==2){
                x =344; y = 283;
            }else if(kind==3){
                x= 185 ; y=300;
            }else if(kind==4) {
                x= 190 ; y=305;
            }
            ct.drawImage(pic, x, y, w, h);
            return ct;
        }

        function drawImg(n,kind){
            if(n<len){
                var img=new Image();
                img.crossOrigin = 'Anonymous'; //解决跨域
                img.src = data.imageList[n];
                console.log(data.imageList[n]);
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
                $(document.body).trigger('cvsImageData',[kind,base64[0]]);

            }
        }
        drawImg(0,data.kind)
    };

    draw.upload = function (kind,base64Data,callback) {
        var xUrl = uploadUrl;
        var submitData={
            imgData:base64Data,
            kind:kind
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

