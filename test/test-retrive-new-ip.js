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

var tr = require('tor-request');
tr.TorControlPort.password = 'mypassword';


var printTOR_IP = function () {

    tr.request('https://api.ipify.org', function (err, res, body) {
    if (!err && res.statusCode == 200) {
        console.log("Your public (through Tor) IP is: " + body);
     }
  });
  };
  
  //print current ip
  console.log('now ip');
   printTOR_IP();
  
  //renew to new ip
  tr.renewTorSession(function (err, msg) {
      console.log(msg);
       if (msg) {
           printTOR_IP();
        }
  });