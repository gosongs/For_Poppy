var schedule = require('node-schedule');
var moment = require('moment');
var shelljs = require('shelljs');
var moment = require('moment');

var jokeTask = schedule.scheduleJob('0 0 18 * * *', fireJoke);

var wetherTask = schedule.scheduleJob('0 0 8 * * *', fireWether);
// var secondsTask = schedule.scheduleJob('* * * * * *', fireSeconds);

console.log('开始监控...')
function fireJoke() {
  shelljs.exec('node app/jokes.js');
}

function fireWether() {
  shelljs.exec('node app/wether.js');
}

function fireSeconds() {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
}
