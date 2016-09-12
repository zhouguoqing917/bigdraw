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
            fillText = function (txt,x,y,fsz,color) {
                fsz =fsz||24;
                ct.font='bold ' +fsz+'px arial,sans-serif ';
                ct.fillStyle = color||'#C13E2C';
                ct.textAlign = 'center';
                ct.fillText(txt,x, y);
            };
            var mx=5;
            var txt1 = [];
            var x=240,y=150;
           //context.fillText(text,x,y,maxWidth);
            var txtarr = text.split('');
            if(kind==1) {
                x = 100;
                y = 125;
                for(var i=0;i<txtarr.length;i++) {
                    var char = txtarr[i];
                    if(i==mx) {
                        //换行
                        x=100;
                        y=200;
                    }
                    x+=46;
                    fillText(char,x,y,44,'#000000');
                }

            }else if(kind==2) {
                x = 35;
                y = 125;
                for(var i=0;i<txtarr.length;i++) {
                    var char = txtarr[i];
                    if(i==mx) {
                        //换行
                        x=35;
                        y=200;
                    }
                    x+=44;
                    fillText(char,x,y,42,'#C13E2C');
                }

            }else if(kind==3) {
                x=135;
                y=158;
                for(var i=0;i<txtarr.length;i++){
                    var char = txtarr[i];
                    if(i==mx) {
                        //换行
                        x=84;
                        y=158;
                    }
                    y+=30;
                    fillText(char,x,y,28,'#C13E2C');
                }

            }else if(kind==4) {
                x = 220;
                y = 140;
                var txtarr = text.split('');
                for(var i=0;i<txtarr.length;i++) {
                    var char = txtarr[i];
                    if(i==mx) {
                        //换行
                        x=220;
                        y=198;
                    }
                    x+=38;
                    fillText(char,x,y,36,'#000000');
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
                x =394; y = 244;
            }else if(kind==2){
                x =271; y = 310;
            }else if(kind==3){
                x= 164 ; y=306;
            }else if(kind==4) {
                x= 201 ; y=293;
            }
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

