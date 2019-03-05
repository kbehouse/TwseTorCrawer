var cp = require('child_process'),
kill  = require('tree-kill'),
 exec = cp.exec,
 spawn = cp.spawn,
 l=console.log;
//  const { exec } = require('child_process');
// var tor = spawn('tor --SocksPort 9030 --ControlPort 9031 --DataDirectory tor_9030');
var port = 9030;
var tor = spawn('tor', ['--SocksPort', port,'--ControlPort',(port+1),'--DataDirectory','tor_'+port,'--HashedControlPassword','16:916133C8A644016E60C2FAFA3B72DE3D20F5955C0F0DACB02CAEC1E2C3']); 

var s_no = 2030;

// var isSuccess = false;
tor.stdout.on('data', function(d){
   console.log(`stdout: ${d}`);
   // l('tor.pid = ' + String(tor.pid));
   if(d.includes("100%")){
     l('tor includes 100%!!');
     getIP();
   }
});


var tr = require('tor-request');
tr.setTorAddress('127.0.0.1', port);
tr.TorControlPort.password = 'mypassword';
tr.TorControlPort.port = port + 1;
function isJson(str) {
   try {
       JSON.parse(str);
   } catch (e) {
       return false;
   }
   return true;
}


function  getData() {
   var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo="+s_no;
   tr.request(url, function (err, res, body) {
      l('=====Start====');
      //l(res);
      // l(res.headers.connection );
      // if (!err && res.statusCode == 200) {
      
      var isOK = isJson(body);

      l('body:::');
      l(body);
      l('isOK='+ isOK);

      if(!isOK){
         renewIP();
      }else{
         s_no+=1;
         require('sleep').sleep(3);
         getData();
      }
   });
}

   
// };
// getData();

var getIP = function (port, again) {
   var tr = require('tor-request');
   tr.setTorAddress('127.0.0.1', port);
   var url = 'https://ifconfig.me';
   tr.request(url, function (err, res, body) {
      if (!err && res.statusCode == 200) {
         console.log("IP: " + body);
         getData();
      }else{
         l(err);
      }
  });
};

function renewIP(){
   tr.renewTorSession(function (err, msg) {
      console.log('renewIP msg = '+msg);
      if (msg) {
         l('in renewIP true');
         getIP();
      }else{
         l('in msg renewIP false');
         getIP();
      }
  });
}

// getIP();
// getData();
