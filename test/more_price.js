var fs = require("fs");
var request = require("request");
var l = console.log;

//save stock number with date in json 
function saveNoWithDate(date = "20190201", s_no = 2330, savePath=''){
    l(savePath);
    savePath = (savePath=='') ?s_no+'.json':savePath; 
    // var date = "20190201";
    // var s_no = 2330;
    var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date="+date +"&stockNo=" + s_no;
    l('save path: ' + savePath);
    request({
        url: url,
        json: true
    }, function (error, response, body) {
        l('REQ ' + url);
        if (!error && response.statusCode === 200) {
            // console.log(body) // Print the json response
            fs.writeFile(savePath, JSON.stringify(body, null, 4), (err) => {
                if (err) {
                    console.error(err);
                    return;
                };
                console.log("File has been created");
            });
        }
    })
}

for(var s_no=2330;s_no<=2400;s_no++){
    saveNoWithDate(date = "20190201",s_no=s_no, savePath='190201_price/'+s_no+'.json');
}
