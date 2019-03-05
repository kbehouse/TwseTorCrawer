var cp = require('child_process');
 exec = cp.exec;
 spawn = cp.spawn;
 tor = spawn('tor');
 puts = function(err,stdo,stde){ console.log(stdo) };


 function sayIP(){
    var tr = require('tor-request');
    tr.request('https://ifconfig.me', function (err, res, body) {
        console.log(err);
        if (!err && res.statusCode == 200) {
            console.log("Your public (through Tor) IP is: " + body);
        }
    });
}
   sayIP();