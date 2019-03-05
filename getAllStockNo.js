var fs = require("fs");
var request = require("request");
var l = console.log;


function processJson(json){
    json.fields.splice(2,json.fields.length);
    json.title="證券代號與證券名稱對應";
    delete json.notes;
    l('Original Stock Count: '+json.data.length);
    for(var i=0 ;i < json.data.length;i++){
        var stock = json.data[i];
        //l(stock[0] + ' stock[0].length='+stock[0].length);
        // l('i='+i +', json.data.length = '+json.data.length);
        if(stock[0].length>4){
            //remove this item
            l('Remove ' + stock[0]);
            json.data.splice(i,1);
            i--;
        }else{
            stock.splice(2,stock.length);
        }
        
    }
    l('After Stock Count: '+json.data.length);
    return json;
}
//save stock number with date in json 
function saveNoWithDate(savePath=''){
    var url = "http://www.twse.com.tw/exchangeReport/TWT53U?response=json&date=20190304&selectType=ALL";

    request({
        url: url,
        json: true
    }, function (error, response, json) {  // because request json:true
        l('REQ ' + url);
        if (!error && response.statusCode === 200) {
            var new_json = processJson(json);
            fs.writeFile(savePath, JSON.stringify(new_json, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
        }
    })
}

saveNoWithDate(savePath = 'StockNo.json');