/*
# node TwseTorCrawer.js -p 9020 -s 2000 > port_9020.log & 
# node TwseTorCrawer.js -p 9030 -s 3000 > port_9030.log & 

*/

var cp = require('child_process'),
tr = require('tor-request');
spawn = cp.spawn,
fs = require("fs"),
l=console.log;

function isJson(str) {
   try {
       JSON.parse(str);
   } catch (e) {
       return false;
   }
   return true;
}

function recreateDir(dir){
   if (fs.existsSync(dir)) { 
      var rmdirSync = require('rmdir-sync');
      rmdirSync(dir);
   } 
   fs.mkdirSync(dir);
}


class TwseTorCrawer{

   //check exist IP, 
   // if exist: return true (renewIP), else: return false
   static checkIpExist(ip){
      if(this._IpList === undefined) {
         this._IpList = [];
         this._IpList.push(ip);
         return false;
      } else{
         if(this._IpList.includes(ip)){
            return true;
         }else{
            this._IpList.push(ip);
            return false;
         }
      } 
    }

   constructor(port, stockNoStart, stockNoEnd, saveDir) {
      this.port = port;
      this.s_no = stockNoStart;
      this.stockNoEnd = stockNoEnd;
      this.saveDir = saveDir;
      this.isReady = false;

      recreateDir(saveDir);

      //setting tr
      tr.setTorAddress('127.0.0.1', this.port);
      tr.TorControlPort.password = 'mypassword';
      tr.TorControlPort.port = this.port + 1;
      
      //setting tor
      var tor_data_dir = 'tor_'+this.port;
      recreateDir(tor_data_dir);
      l('Using port='+port);
      this.tor = spawn('tor', ['--SocksPort', this.port,'--ControlPort',(this.port+1),'--DataDirectory',tor_data_dir,'--HashedControlPassword','16:8DA637FF351881DA6066502CCEC4DE6D35C00E2615768EF24AD269DCD9']); 
      this.tor.stdout.on('data', (d)=>{
         console.log(`stdout: ${d}`);
         // l('tor.pid = ' + String(tor.pid));
         if(d.includes("100%")){
            l("[ Port " +  this.port + " 100%] tor includes 100%!!");
            this.getIP();
         }
      });

      this.tor.on('exit', ()=>{
            console.log("[ Port " +  this.port + " exit] tor on exit!");
      });
          
      // close 事件：鎖定系統 close 事件，子處理程序的所有標準輸入、輸出(stdio)資料流被終止時觸發
      this.tor.on('close', ()=>{
         console.log("[ Port " +  this.port + " close] tor on close!");
      });
   }

   getIP() {
      var url = 'https://ifconfig.me';
      tr.request(url, (err, res, body) =>{
         if (!err && res.statusCode == 200) {
            console.log("[ Port " +  this.port + " IP] IP:"  + body);
            if(TwseTorCrawer.checkIpExist(body)){
               l("[ Port " +  this.port + " IP Exist] IP:"  + body +" RENEW");
               this.renewIP();
            }else{
               this.getData();
            }
         }else{
            l(err);
         }
     });
   }

   getData() {
      var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo="+this.s_no;
      tr.request(url,  (err, res, body) =>{
         // l('=====Start====');
         var isOK = isJson(body);
         // l(body);
         // l('isOK='+ isOK);
   
         if(!isOK){
            this.renewIP();
         }else{
            var stat = JSON.parse(body).stat;
            if(stat=="OK"){
               var savePath = this.saveDir + this.s_no +'.json';
               //fs.writeFile(savePath, JSON.stringify(body, null, 4), (err) => {
               fs.writeFile(savePath, body, (err) => {
                  if (err) {
                     console.error(err);
                     return;
                  };
                  console.log(savePath +" has been created");
               });
            }else{
               console.log(this.s_no + " => " + stat);
            }
            if(this.s_no<this.stockNoEnd){
               this.s_no+=1;
               this.isReady = true;
               setTimeout(()=> {
                  //console.log('hello world!');
                  this.getData();      
                }, 3000);
                      
            }else{
               l("[ Port " +  this.port + " finish] Crawing Finish in "+this.saveDir);
               this.tor.kill();
            }
                      
         }
      });
   }

   renewIP(){
      tr.renewTorSession( (err, msg)=> {
         console.log("[ Port " +  this.port + " renewIP] msg = "+msg);
         if (msg) {
            l('in renewIP true');
         }else{
            l('in msg renewIP false');   
         }
         this.getIP();
     });
   }
   
}

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
   version: '0.0.1',
   addHelp:true,
   description: 'TWSE Stock Index'
 });
 parser.addArgument(
   [ '-p', '--port' ],
   {
     help: 'Tor port'
   }
 );
 parser.addArgument(
   [ '-s', '--stockStart' ],
   {
     help: 'stock start number'
   }
 );
var args = parser.parseArgs();
// console.dir(args);
var port = parseInt(args.port);
var stockStart = parseInt(args.stockStart);
// l('Start port='+port +', stackStart='+stockStart);
// var port = 9030;
// var stockStart = 2000;
l('Start port='+port +', stackStart='+stockStart);
var ttc = new TwseTorCrawer(port, stockStart,stockStart+999, stockStart + '/');


/*
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const main = async () => {
   for (var i=2;i<10;i++){
      var port = 9000 + i*10;
      var stackStart = i*1000;
      
      l('Start port='+port +', stackStart='+stackStart);
      var ttc = new TwseTorCrawer(port, stackStart,stackStart+999, stackStart + '/');

      while(1){
         await snooze(3000);
         if(ttc.isReady){
            l('Continue sleep...');
            break;
         }   
      }
   }
}
main();
*/