var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var async = require('async');
var eventproxy = require('eventproxy');

var url = 'http://desk.zol.com.cn/2880x1800/';
var dir = './images';
var links = [];
var urls = [];
for (var i = 1; i <= 3; i++) {
  var _ = url + i + '.html';
  urls.push(_);
}

mkdirp(dir, function (err) {
  if (err) {
    console.log(err);
  }
  getImgUrl();
});

function getImgUrl() {
  var ep = new eventproxy();
  ep.after('over', urls.length, function (u) {
    for (var i = 0; i < u.length; i++) {
      for (var j = 0; j < u[i].length; j++) {
        links.push(u[i][j]);
      }
    }
    eachImg(links);
  });

  urls.forEach(function (url) {
    request(url, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        var $ = cheerio.load(body);
        var curLinks = [];
        $('.photo-list-padding a img').each(function () {
          var src = $(this).attr('src');
          src = src.replace(/t_s208x130c5/, 't_s2880x1800c5');
          curLinks.push(src);
        });

        ep.emit('over', curLinks);
      }
    });
  });
}

function eachImg(links) {
  async.mapSeries(links, function (_, cb) {
    var rand = Math.floor(Math.random() * 100000) + _.substr(-4, 4);
    download(_, dir, rand);
    cb(null, _);
  });
}

function download(url, dir, filename) {
  request.head(url, function (err, res, body) {
    var writeStream = fs.createWriteStream(dir + '/' + filename);
    writeStream.on('error', function (err) {
      console.log(err);
    });
    writeStream.on('end', function () {
      console.log('下载完成: ' + url);
    })
    request(url).pipe(writeStream);
  })
}

