/* before use this
# tor
*/
var fs = require('fs');
var tr = require('tor-request');
var url  = 'http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2032';
// var url = 'https://ifconfig.me';
// tr.request({
//     url: 'https://www.google.com.np/images/srpr/logo11w.png',
//     strictSSL: true,
//     agentClass: require('socks5-https-client/lib/Agent'),
//     // agentOptions: {
//     //   socksHost: 'my-tor-proxy-host', // Defaults to 'localhost'.
//     //   socksPort: 9050, // Defaults to 1080.
//     //   // Optional credentials
//     //   socksUsername: 'proxyuser',
//     //   socksPassword: 'p@ssw0rd',
//     // }
//    }, function(err, res) {
//     console.log(err || res.body);
//    }).pipe(fs.createWriteStream('doodle.png'))

tr.request({
    url: url,
    strictSSL: true,
    agentClass: require('socks5-http-client/lib/Agent'),
    // agentOptions: {
    //   socksHost: 'my-tor-proxy-host', // Defaults to 'localhost'.
    //   socksPort: 9050, // Defaults to 1080.
    //   // Optional credentials
    //   socksUsername: 'proxyuser',
    //   socksPassword: 'p@ssw0rd',
    // }
   }, function(err, res) {
    console.log(err || res.body);
   }).pipe(fs.createWriteStream('test.json'))

