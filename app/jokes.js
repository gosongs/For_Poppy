const cheerio = require('cheerio');
const request = require('request');
const async = require('async');
const config = require('./config');
const nodemailer = require("nodemailer");

let pageNum = 1;
let maxPageNum = 20;
let jokeType = '8hr';

var jokesData = [];
var urls = [];
var emails = [];
var EMAIL = {
  host: 'smtp.163.com',
  port: 465,
  auth: {
    user: 'by_openwater@163.com',
    pass: 'liuzhiyuan1993'
  }
};
for (var i = 1; i <= maxPageNum; i++) {
  // https://www.qiushibaike.com/8hr/page/2/?s=4987343
  urls.push(`http://www.qiushibaike.com/${jokeType}/page/${i}/?s=4978418`)
}

config.userList.map((_, i) => {
  emails.push(_.email);
})

async.mapLimit(urls, 1, function (url, callback) {
  fetchJokes(url, callback);
}, function (err, res) {
  jokesData.sort(function (a, b) {
    return b.likes - a.likes;
  });
  jokesData = jokesData.slice(0, 15);
  sendEmail();
});

function fetchJokes(url, callback) {
  request({
    url: url,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
    }
  }, function (err, res, body) {
    if (!err && res.statusCode === 200) {
      var $ = cheerio.load(body);
      $('#content-left>div').each((i, _) => {
        const $el = $(_);
        let joke = {
          author: '',
          content: '',
          likes: '',
          thumb: ''
        };

        if (!$el.find('.article .content .contentForAll').length) { // 刨除需要查看全文的笑话
          joke.author = $el.find('.author h2').text();
          joke.content = $el.find('.content>span').text();
          joke.likes = $el.find('.stats-vote .number').text();
          if ($el.find('.article .thumb').length) {
            joke.thumb = $el.find('.article .thumb img').attr('src');
          }
          jokesData.push(joke);
        }
      });
      console.log(`当前: ${url}`);
      callback(null, url);
    } else {
      console.log('出错了');
      console.log(err);
      callback(null, url);
    }
  });
}

function sendEmail() {
  async.mapLimit(emails, 1, function (email, callback) {
    fireEmail(email, callback);
  }, function (err, res) {
    console.log('Mail Send Over');
  });
}

function fireEmail(email, callback) {
  var html = '';
  jokesData.map((_, i) => {
    var t = `<p style="margin-top: 2em;">${_.content}</p>`;
    if (_.thumb) {
      t += `<p><img src="${_.thumb}" /></p></br></br>`;
    }
    html += t;
  });
  
  var data = {
    from: EMAIL.auth.user,
    to: email,
    subject: '糗事百科8小时点赞最多的15条笑话',
    html: html
  };
  var transporter = nodemailer.createTransport(EMAIL);
  transporter.sendMail(data, function (error, info) {
    if (error) {
      console.log(error);
      console.log('Mail Error: ' + email);
    } else {
      console.log('Mail Success: ' + email);
    }
    callback(null, email);
  });
}