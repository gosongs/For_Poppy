var config = require("../config/config");
var sms = config.sms;
var App = require('alidayu-node');
var app = new App(sms.appKey, sms.appSecret); 

/**
 * 发送短信
 * @param {天气内容} data 数据结构与短信模板有关 
 * @param {手机号} phone 
 */
function sendSms(data, phone) {
  app.smsSend({
    sms_free_sign_name: sms.signName,
    sms_param: JSON.stringify(data),
    rec_num: phone,
    sms_template_code: sms.templateID
  }, function (err, res) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = sendSms;