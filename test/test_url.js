var fs = require("fs");
var request = require("request");
var l = console.log;

var savePath = 'test.json'
var url = "http://www.tse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20190201&stockNo=2032";
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