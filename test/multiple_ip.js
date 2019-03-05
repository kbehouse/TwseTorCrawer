
var tr = require('tor-request');
// defualt: 9050
tr.request('https://api.ipify.org', function (err, res, body) {
    console.log('in tor1');
    if (!err && res.statusCode == 200) {
        console.log("Your public (through Tor) IP is: " + body);
     }
});
console.log('hi to run tor2')
var tr2 = require('tor-request');
tr2.setTorAddress('127.0.0.1', 8050);
tr2.request('https://api.ipify.org', function (err, res, body) {
    console.log('in tor2');
    if (!err && res.statusCode == 200) {
        console.log("Your public (through Tor) IP is: " + body);
     }
});