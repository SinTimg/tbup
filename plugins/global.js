import Vue from 'vue'
Vue.prototype.getImagePath = (path) => path?'/upload/' + path:'/none.png'
Vue.prototype.getMinImagePath = (path) => path?'/upload/min/' + path:'/none.png'
Vue.prototype.getTime = function(time){
    return time?time.split('T')[0]:""
}
Vue.prototype.curDate = function() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; 
    var curr_year = d.getFullYear();
    String(curr_month).length < 2 ? (curr_month = "0" + curr_month): curr_month;
    String(curr_date).length < 2 ? (curr_date = "0" + curr_date): curr_date;
    var yyyyMMdd = curr_year + "" + curr_month +""+ curr_date;
    return yyyyMMdd;
}