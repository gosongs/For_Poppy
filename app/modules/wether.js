var http = require("http");
var nodemailer = require("nodemailer");
var config = require("../config/config");
var userList = config.userList;
var sendSms = require("./sms");
var URL = require("../utils/url");
var parseString = require('xml2js').parseString;

/**
 * 调用新浪接口获取天气数据
 * http://www.voidcn.com/blog/KevinWu93/article/p-4898393.html
 */
userList.map(function (_, i) {
  // 将中文转码, 注意这里是 gbk2312 格式
  var cityEnc = URL.encode(_.city);
  var url = `http://php.weather.sina.com.cn/xml.php?city=${cityEnc}&password=DJOYnieT8234jlsK&day=0`;

  http.get(url, function (res) {
    var xmlData = '';

    // 写入数据
    res.on("data", function (data) {
      xmlData += data.toString('utf8');
    });

    res.on("end", function () {
      // 读取 xml 数据
      parseString(xmlData, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.Profiles) {
            var r = result.Profiles.Weather[0];

            // 长度过长, 会发送失败, 这里只截取3条
            var sug = r.chy_shuoming[0].split('、');
            var sug_fixed = sug[0];
            if (sug[1]) {
              sug_fixed = sug_fixed + '、' + sug[1];
            }
            if (sug[2]) {
              sug_fixed = sug_fixed + '、' + sug[2];
            }

            // 包含天气数据, 数据格式与配置的模板有关
            var d = {
              a: `今日${_.city}`,
              b: `白天${r.status1}夜间${r.status2}`,
              c: `${r.temperature1}℃`,
              d: `${r.temperature2}℃`,
              e: sug_fixed
            };

            // 将天气发送给用户
            sendSms(d, _.phone);
          } else {
            console.log('出错了');
          }
        }
      });
    });
  })
});