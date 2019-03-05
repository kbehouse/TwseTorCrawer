var cp = require('child_process'),
kill  = require('tree-kill'),
 exec = cp.exec,
 spawn = cp.spawn,
 l=console.log;
//  const { exec } = require('child_process');

function isJson(str) {
   try {
       JSON.parse(str);
   } catch (e) {
       return false;
   }
   return true;
}

 function  getData() {
   // var tor = spawn('tor --SocksPort 9030 --ControlPort 9031 --DataDirectory tor_9030');
   var port = 9030;
   var tor = spawn('tor', ['--SocksPort', port,'--ControlPort',(port+1),'--DataDirectory','tor_'+port]); 
   // data 事件：截取 console 輸出物件 stdout 的 data 事件
   var isSuccess = false;
   tor.stdout.on('data', function(d){
      console.log(`stdout: ${d}`);
      l('tor.pid = ' + String(tor.pid));
      var tr = require('tor-request');
      tr.setTorAddress('127.0.0.1', port);
      
      var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2030";
      tr.request(url, function (err, res, body) {
         l('=====Start====');
         //l(res);
         // l(res.headers.connection );
         // if (!err && res.statusCode == 200) {
         
         var isOK = isJson(body);

         l('body:::');
         l(body);
         l('isOK='+ isOK);

         if(isOK){
            getIP(port,false);
         }else{
            getIP(port,true);
            // getData();
         }
            //       l('in kill');
            //       // kill(tor.pid); 
            //       getData();
            //    }else{
            //       isSuccess =true;
            //       console.log("SucessData: " + body);
            //       l('GOGOGO GOOOOOD');
            //       getIP(port);
            //    }
         // if (!err){
         //    if(res.headers.connection =='close'){
         //       l('in kill');
         //       // kill(tor.pid); 
         //       getData();
         //    }else{
         //       isSuccess =true;
         //       console.log("SucessData: " + body);
         //       l('GOGOGO GOOOOOD');
         //       getIP(port);
         //    }
         // }else{
         //    l('in err');
         //    l(err);
         //    // l('res.statusCode = '+ res.statusCode);
         // }
      });
      /*
      tr.request('https://ifconfig.me', function (err, res, body) {
        console.log(port + 'ERROR' + err);
        console.log(err);
        if (!err && res.statusCode == 200) {
            console.log(port + ", Your public (through Tor) IP is: " + body);
        }
    });*/
   });
 
 //exit 事件：鎖定系統 exit 事件，此事件發生時，子處理程序的標準輸入、輸出(stdio)，資料流可能仍為開啟狀態
//  tor.on('exit', function(){
//    console.log("cat on exit!");
//  });
 
// // close 事件：鎖定系統 close 事件，子處理程序的所有標準輸入、輸出(stdio)資料流被終止時觸發
// tor.on('close', function(){
//    console.log("cat on close!");
//    if(!isSuccess){

//       getData();
//    }
   
//  });

   
};


/*
var getData = function () {
   var child2 = exec('tor --SocksPort 9030 --ControlPort 9031 --DataDirectory tor_9030', function(error, stdout, stderr){
          console.info('cat child_process.js stdout: ');
          console.log(stdout);

         var tr = require('tor-request');
         tr.setTorAddress('127.0.0.1', port);
         var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2030";
         tr.request(url, function (err, res, body) {
            l(res.headers.connection );
            if(res.headers.connection =='close'){
               getData();
            }else{
               console.log("Data: " + body);
               getIP();
            }
         });
        });
   
};

*/

var getIP = function (port, again) {
   var tr = require('tor-request');
   tr.setTorAddress('127.0.0.1', port);
   var url = 'https://ifconfig.me';
   tr.request(url, function (err, res, body) {
      if (!err && res.statusCode == 200) {
         console.log("IP: " + body);

         if(again){
            getData();
         }
      }
  });
};
getData();
// exec('tor', function(error, stdout, stderr){
//    console.info('cat child_process.js stdout: ');
//    console.log(stdout);
// });
// exec('tor --SocksPort 9030 --ControlPort 9031 --DataDirectory tor_9030', function(error, stdout, stderr){
//    console.info('cat child_process.js stdout: ');
//    console.log(stdout);
// });