var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();
var ROOT_PATH = path.normalize(path.join(__dirname, '../'));

//保存base64图片POST方法
router.all('/upload', function (req, res, next) {
    var imgData = req.body.imgData || '';
    var kind = req.body.kind;
    //过滤data:URL
    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    var dataBuffer = new Buffer(base64Data, 'base64');

    var uuid = new Date().getTime();
    var filename = "canvs-" + uuid + '.jpeg';
    fs.writeFile(ROOT_PATH + '/public/images/' + filename, dataBuffer, function (err) {
        if (err) {
            res.send({
                status: '0',
                url: '',
                content: "error"
            });
        } else {
            var url = req.protocol + "://" + req.hostname + '/nodejs/images/' + filename;
            console.log(url);
            res.send({
                status: '200',
                url: url,
                content: "success"
            });
        }
    });
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'nodejs min Server'});
});

module.exports = router;
