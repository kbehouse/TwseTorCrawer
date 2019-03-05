/* before use this
#  tor --hash-password mypassword
16:872860B76453A77D60CA2BB8C1A7042072093276A3D701AD684053EC4C
# vim ~/.tor/kbe_tor
```
ControlPort 9051
HashedControlPassword 16:872860B76453A77D60CA2BB8C1A7042072093276A3D701AD684053EC4C
```

Run: 
tor -f ~/.tor/kbe_tor

*/

// var tr = require('tor-request');
// tr.TorControlPort.password = 'mypassword';

var l=console.log;

var getData = function () {
   var tr = require('tor-request');
   var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2030";
   tr.request(url, function (err, res, body) {
      l(res.headers.connection );
      if(res.headers.connection =='close'){
         getData();
      }else{
         console.log("Data: " + body);
         getIP(tr);
      }
  });
};

var getIP = function (tr) {
   var url = 'https://ifconfig.me';
   // var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2030";
   tr.request(url, function (err, res, body) {
      l(res.headers.connection );
      if (!err && res.statusCode == 200) {
         renewIP();
      }else{
         console.log("Data: " + body);
      }
  });
};

  //print current ip
console.log('now ip');
getData();
  
// function renewIP(){
//    //renew to new ip
//    tr.renewTorSession(function (err, msg) {
//       console.log(msg);
//          // if (msg) {
//          //    printTOR_IP();
//          // }
//    });
// }