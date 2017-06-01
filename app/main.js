var schedule = require('node-schedule');
var moment = require('moment');
var shelljs = require('shelljs');
var moment = require('moment');

// 每天晚上六点发送笑话
var jokeTask = schedule.scheduleJob('0 0 10 * * *', fireJoke);

// 每天早上八点发送天气
var wetherTask = schedule.scheduleJob('0 0 8 * * *', fireWether);

console.log('开始监控...')
function fireJoke() {
  shelljs.exec('node app/modules/jokes.js');
}

function fireWether() {
  shelljs.exec('node app/modules/wether.js');
}