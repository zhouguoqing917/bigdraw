var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var ROOT_PATH = path.normalize(path.join(__dirname, '../'));

//保存base64图片POST方法
router.all('/uploadBase64Data', function (req, res, next) {
    var imgData = req.body.imgData ||req.body.pic|| '';
    var hostname = req.body.hostname  || '127.0.0.1';

    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');

    var uuid = new Date().getTime();
    var filename = "canvs-" + uuid + '.jpeg';
    fs.writeFile( ROOT_PATH+'/public/photo/' + filename, dataBuffer, function (err) {
        if (err) {
            res.send({
                status: '100',
                message:'error',
                data: {url:''}
            });
        } else {
            var url ='http://' +hostname+ '/nodejs/photo/' + filename;
            console.log(url);
            res.send({
                status: '0',
                message:'success',
                data: {url: url}
            });
        }
    });
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'nodejs min Server'});
});
router.get('/testnjs', function (req, res, next) {
    res.send({title: 'nodejs min Server'});
});

module.exports = router;
