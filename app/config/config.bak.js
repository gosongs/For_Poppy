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
    appKey: 'app key', // 申请的 app key
    appSecret: 'app secret', // 申请的 app secret
    signName: '超级小远远', // 短信签名名称
    templateID: 'SMS_69260175' // 短信模板ID
  },
  email: {
    pass: 'xxxxxxx' // 163 邮箱授权码, 注意不是密码
  }
};

module.exports = config;
