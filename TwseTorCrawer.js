/*
# node TwseTorCrawer.js -p 9010 -s 1000 -e 1999 > port_9010.log & 
# node TwseTorCrawer.js -p 9020 -s 2000 -e 2999 > port_9020.log & 
# node TwseTorCrawer.js -p 9030 -s 3000 -e 3999 > port_9030.log & 
*/

var cp = require('child_process'),
tr = require('tor-request'),
moment = require('moment'),

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

function createDir(dir){
   if (!fs.existsSync(dir)) { 
      fs.mkdirSync(dir);
   } 
}

function numStr(num){
   if(num<10)  return "0"+num;
   else return String(num);
}

var stockNoJson = JSON.parse(fs.readFileSync('StockNo.json', 'utf8'));
function checkStockNo(s_no){
    for(var i=0 ;i < stockNoJson.data.length;i++){
        if(stockNoJson.data[i][0]==s_no){
            return true;
        }
    }
    return false;
}

var tor;
function prepareTor(port, startFun){
   //setting tor
   var tor_data_dir = 'tor_'+port;
   recreateDir(tor_data_dir);
   l('Using port='+port);
   tor = spawn('tor', ['--SocksPort', port,'--ControlPort',(port+1),'--DataDirectory',tor_data_dir,'--HashedControlPassword','16:8DA637FF351881DA6066502CCEC4DE6D35C00E2615768EF24AD269DCD9']); 
   tor.stdout.on('data', (d)=>{
      console.log(`stdout: ${d}`);
      // l('tor.pid = ' + String(tor.pid));
      if(d.includes("100%")){
         l("[ Port " +  this.port + " 100%] tor includes 100%!!");
         // this.getIP();
         startFun();
      }
   });

   tor.on('exit', ()=>{
         console.log("[ Port " +  this.port + " exit] tor on exit!");
   });
       
   tor.on('close', ()=>{
      console.log("[ Port " +  this.port + " close] tor on close!");
   });
}


class TwseTorCrawer{
   constructor(port, stockNo, saveDir, timeMethod="Asc",startYear, endYear) {
      this.port = port;
      this.s_no = stockNo;
      this.saveDir = saveDir;
      this.isReady = false;

      this.timeMethod = timeMethod;
      if (timeMethod=="Asc"){
         this.nowYear = startYear;
         this.nowMon = 1;
         this.endYear = endYear;
      }else if(timeMethod=="DescFromNow"){
         var d = new Date();
         this.nowYear = d.getFullYear();
         this.nowMon = d.getMonth()+ 1;
         l('this.nowYear = '+ this.nowYear+', this.nowMon=' + this.nowMon);
      }
      
      recreateDir(saveDir);

      //setting tr
      tr.setTorAddress('127.0.0.1', this.port);
      tr.TorControlPort.password = 'mypassword';
      tr.TorControlPort.port = this.port + 1;   
   }

   getIP() {
      var url = 'https://ifconfig.me';
      tr.request(url, (err, res, body) =>{
         if (!err && res.statusCode == 200) {
            console.log("[ Port " +  this.port + " IP] IP:"  + body);
            // if(TwseTorCrawer.checkIpExist(body)){
            //    l("[ Port " +  this.port + " IP Exist] IP:"  + body +" RENEW");
            //    this.renewIP();
            // }else{
            this.getData();
            // }
         }else{
            l(err);
         }
     });
   }

   isGetNewData(){
      // l('this.nowYear = ' + this.nowYear + ',this.nowMon=' + this.nowMon);
      
      var finish = false;
      if(this.timeMethod=="ASC"){
         if(this.nowMon>=12){
            this.nowYear = this.nowYear+1;
            this.nowMon = 1;
         }else{
            this.nowMon += 1;
         }
         if(this.nowYear<this.endYear || (this.nowYear==this.endYear&& this.nowMon<=12)){
            finish = false;
         }else{
            finish = true;
         }
      }else if(this.timeMethod=="DescFromNow"){
         if(this.nowMon<=1){
            this.nowYear = this.nowYear-1;
            this.nowMon = 12;
         }else{
            this.nowMon -= 1;
         }
         finish = false;
      }
      
      if(finish==false){
         setTimeout(()=> {
               this.getData();      
            }, 3000);            
      }else{
         l("[ Port " +  this.port + " finish] Crawing Finish in "+this.saveDir);
         //this.tor.kill();
         this._finishFunc();
         return ;
      }
   }

   getData() {   
      var reqMon = String(this.nowYear) + numStr(this.nowMon) ;
      var reqDate = reqMon +"01";
      var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date="+ reqDate + "&stockNo="+this.s_no;
      // l(url);
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
               var savePath = this.saveDir + reqMon +'.json';
               // l(savePath);
               // fs.writeFile(savePath, JSON.stringify(body, null, 4), (err) => {
               fs.writeFile(savePath, body, (err) => {
                  if (err) {
                     console.error(err);
                     return;
                  };
                  console.log(savePath +" has been created");
                  this.isGetNewData();
               });
               // fs.writeFileSync(savePath, body, 'utf8');
            }else{
               console.log(this.s_no + " => " + stat);
               this._finishFunc();
               return;
            }          
         }
      });
   }

   renewIP(){
      tr.renewTorSession( (err, msg)=> {
         console.log("[ Port " +  this.port + " renewIP] msg = "+msg);
         if (!msg) {
            l('in msg renewIP false');   
         }
         this.getIP();
     });
   }

   set finishFunc(func) {
      this._finishFunc = func;
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
 parser.addArgument(
   [ '-e', '--stockEnd' ],
   {
     help: 'stock start number'
   }
 );
var args = parser.parseArgs();
// console.dir(args);
var port = parseInt(args.port);
var stockStart = (args.stockEnd==undefined) ? 1101 : parseInt(args.stockStart); 
var stockEnd =  (args.stockEnd==undefined) ? (stockStart+999) : args.stockEnd;
var startYear = 2019;
var endYear = 2019;

function startCrawer(){
   // for(var stackNo=stockStart;stackNo<stockEnd;stackNo++){
   var stackNo=stockStart;   
   var startDate = moment();
   var calculateDiffTime = ()=>{
      var endDate = moment()
      var secondsDiff = endDate.diff(startDate, 'seconds');
      return secondsDiff;
   }

   var getOneStock = () => {
      if(checkStockNo(stackNo)){
         l( (stackNo-1) +' use time: ' + calculateDiffTime() + 's' );
         startDate = moment();
         // var ttc = new TwseTorCrawer(port, stackNo, 'stocks/' + stackNo +'/',startYear, endYear);
         var ttc = new TwseTorCrawer(port, stackNo, 'stocks/' + stackNo +'/', timeMethod="DescFromNow");
         if (stackNo<stockEnd){
            // l(fa);
            stackNo+=1;
            ttc.finishFunc = getOneStock;
         }if(stackNo==stockEnd){
            ttc.finishFunc = ()=>{
               tor.kill();
            }
            return;
         }
         ttc.getIP();
      }else{
         stackNo++;
         getOneStock();
      }  
   }
   getOneStock();
}

createDir('stocks/');
prepareTor(port, startCrawer);

// startCrawer();