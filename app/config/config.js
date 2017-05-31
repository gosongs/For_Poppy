config = {
  // 配置用户列表
  userList: [
    {
      name: 'go songs',
      email: 'go_songs@163.com',
      city: '上海', // 以 city 的值查询天气
      phone: 15800651893
    }
  ],
  // 通过阿里大鱼平台发送短信
  sms: {
    appKey: '23873072', // 申请的 app key
    appSecret: 'fbaeacdcb40fdf130305fd3204b46226', // 申请的 app secret
    signName: '超级小远远', // 短信签名名称
    templateID: 'SMS_69260175' // 短信模板ID
  }
};

module.exports = config;
