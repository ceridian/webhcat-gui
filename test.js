var u = require('./lib/util.js');
var l = require('./lib/lib.js');
var models = require('./models');
var async = require('async');
var a = require('./lib/auth.js');

debugFlag = 'true';

// Date.prototype.dateStamp = function() {  // outputs a string timestamp of a date  // yyyy-mm-dd hh:mm
//   var yyyy = this.getFullYear().toString();
//   var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
//   var dd  = this.getDate().toString();
//   var h = this.getFullHours().toString();
//   var m = this.getFullMinutes().toString();
//   return yyyy +'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+ (dd[1]?dd:"0"+dd[0]) +' '+h+':'+m; // padding
// };
// Date.prototype.getFullMinutes = function () {  // if min single diget add a 0
//   if (this.getMinutes() < 10) {
//     return '0' + this.getMinutes();
//   }
//   return this.getMinutes();
// };
// Date.prototype.getFullMonth = function(){  // if month single diget add a 0
//   if (this.getMonth() < 9) {
//     return '0' + (1 + this.getMonth());
//   }
//   return 1 + this.getMonth();
// };
// Date.prototype.getFullHours = function(){  // if hour single diget add a 0
//   if (this.getHours() < 10) {
//     return '0' + this.getHours();
//   }
//   return this.getHours();
// };
// Date.prototype.getFullDate = function(){  // if date single diget add a 0
//   if (this.getDate() < 10) {
//     return '0' + this.getDate();
//   }
//   return this.getDate();
// };
// Date.prototype.getPreviousDate = function(i){
//   return new Date(new Date().setDate(new Date().getDate()-i));
// };

function start(){
  l.configs(function(err, res){
    console.log(err, res.webhcat_host.value.current.ipAddr);
  });
}
start();
