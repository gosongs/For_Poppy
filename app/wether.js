var http = require("http");
var nodemailer = require("nodemailer");
var cityList = require("./cityList");
var config = require("./config");
var userList = config.userList;
var sendSms = require("./sms");
var URL = require("./libs/url");
var parseString = require('xml2js').parseString;

/**
 * 获取天气数据
 */
userList.map(function (_, i) {
  var cityEnc = URL.encode(_.city);
  var url = `http://php.weather.sina.com.cn/xml.php?city=${cityEnc}&password=DJOYnieT8234jlsK&day=0`;

  http.get(url, function (res) {
    var xmlData = '';
    res.on("data", function (data) {
      xmlData += data.toString('utf8');
    });

    res.on("end", function () {
      parseString(xmlData, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.Profiles) {
            var r = result.Profiles.Weather[0];
            var sug = r.chy_shuoming[0].split('、');
            var sug_fixed = sug[0]; // 长度过长, 会发送失败, 这里只截取3条
            if (sug[1]) {
              sug_fixed = sug_fixed + '、' + sug[1];
            }
            if (sug[2]) {
              sug_fixed = sug_fixed + '、' + sug[2];
            }
            var d = {
              a: `今日${_.city}`,
              b: `白天${r.status1}夜间${r.status2}`,
              c: `${r.temperature1}℃`,
              d: `${r.temperature2}℃`,
              e: sug_fixed
            };
            sendSms(d, _.phone);
          } else {
            console.log('出错了');
          }
        }
      });
    });
  })
});