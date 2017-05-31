var App = require('alidayu-node');
var app = new App('App Key', 'App Secret'); // 配置 key 和 secret

function sendSms(data, phone) {
  app.smsSend({
    sms_free_sign_name: '超级小远远', // 短信签名名称
    sms_param: JSON.stringify(data),
    rec_num: phone,
    sms_template_code: 'SMS_69260175' // 短信模板ID
  }, function (err, res) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = sendSms;