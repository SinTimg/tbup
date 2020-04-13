var moment = require('moment');

moment.locale('zh-cn');
var today = {};
var _today = moment();
today.year = _today.format('yyyy'); /*现在的年*/
today.date = _today.format('YYYY-MM-DD'); /*现在的时间*/
today.yesterday = _today.subtract(1, 'days').format('YYYY-MM-DD'); /*前一天的时间*/
today.tomorrow = _today.subtract(-2, 'days').format('YYYY-MM-DD'); /*后一天的时间*/

var formatDate = moment(12345678977).format('YYYY-MM-DD HH:mm:ss'); /*格式化时间*/
console.log(moment().format('YYYY-MM-DD'))
console.log(moment().subtract(-1, 'days').format('YYYY-MM-DD'))