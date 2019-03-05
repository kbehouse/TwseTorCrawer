var cp = require('child_process');
 exec = cp.exec;
 spawn = cp.spawn;
// tor = spawn('tor', ['--SocksPort', '9010'],['--ControlPort','9011'],['--DataDirectory','/Users/kartik/AppDev/twse/test/tor_9010']); 
// puts = function(err,stdo,stde){ console.log(stdo) };
// var tor2 = spawn('tor', ['--SocksPort', '9030','--ControlPort','9031','--DataDirectory','tor_9030']); 
// var child = exec('tor --SocksPort 9010 --ControlPort 9011 --DataDirectory tor_9010', function(error, stdout, stderr){
//     console.info('cat child_process.js stdout: ');
//     console.log(stdout);
//   });
//   var child2 = exec('tor --SocksPort 9030 --ControlPort 9031 --DataDirectory tor_9030', function(error, stdout, stderr){
//     console.info('cat child_process.js stdout: ');
//     console.log(stdout);
//   });
function spawn_tor(port){
    console.log('Spawn tor on port '+ port);
    var tor = spawn('tor', ['--SocksPort', port,'--ControlPort',(port+1),'--DataDirectory','tor_'+port]); 
} 

function sayIP(port){
    console.log('Try tor port ' + port);
    var tr = require('tor-request');
    tr.setTorAddress('127.0.0.1', port);
    tr.request('https://ifconfig.me', function (err, res, body) {
        console.log(port + 'ERROR' + err);
        console.log(err);
        if (!err && res.statusCode == 200) {
            console.log(port + ", Your public (through Tor) IP is: " + body);
        }
    });
}
spawn_tor(9010);
spawn_tor(9030);

sayIP(9010);
sayIP(9030);
