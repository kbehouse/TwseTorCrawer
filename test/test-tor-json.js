/* before use this
# tor
*/
var tr = require('tor-request');
var url  = 'http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2032';
// var url = 'https://ifconfig.me';
tr.request({
    url: url,
    json: true
}, function (err, res, body) {
    console.log(err);
    if (!err && res.statusCode == 200) {
        console.log("Your public (through Tor) IP is: " + body);
     }
});
// require('sleep').sleep(10);
//https://api.ipify.org
//https://ifconfig.me
//