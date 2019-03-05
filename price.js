var fs = require("fs");
var cp = require('child_process');
spawn = cp.spawn;
exec = cp.exec;
var l = console.log;
const torBindIP = '127.0.0.1';

function spawn_tor(port){
    console.log('Spawn tor on port '+ port);
    // var tor = spawn('tor', ['--SocksPort', port,'--ControlPort',(port+1),'--DataDirectory','tor_'+port]); 
    var tor_dir='tor_'+port;
    var cmd = 'tor --SocksPort '+port +' --ControlPort  '+(port+1) +' --DataDirectory ' + tor_dir;
    var child = exec(cmd, function(error, stdout, stderr){
            console.info('cat child_process.js stdout: ');
            console.log(stdout);
          });
} 


//save stock number with date in json 
function saveNoWithDate(tr = null, date = "20190201", s_no = 2330, savePath=''){
    savePath = (savePath=='') ?s_no+'.json':savePath; 
    const dateTime = Date.now();
    var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date="+date +"&stockNo=" + s_no+"&_="+dateTime;
    // l('save path: ' + savePath);
    tr.request(url, function (error, response, body) {
        l('REQ ' + url);
        
        if (!error && response.statusCode === 200) {
            // console.log(body) // Print the json response
            fs.writeFile(savePath, JSON.stringify(body, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log(savePath +" has been created");
            });
        }else{
            l(error);
        }
    })
}
function runPort(tr_port = 9010, s_no=2330){
    spawn_tor(tr_port);
    var tr = require('tor-request');
    tr.setTorAddress(torBindIP, tr_port);
    saveNoWithDate(tr,date = "20190201",s_no=s_no);
}
// var tr_port = 9020;
// spawn_tor(tr_port);
// var tr2 = require('tor-request');
// tr2.setTorAddress(torBindIP, tr_port);
// saveNoWithDate(tr2,date = "20190201",s_no=2331);
runPort(9010,2033);
// runPort(9020,2032);


// l(dateTime)
