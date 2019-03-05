/*
# get all stock number save to  StockNo.json
# node getAllStockNo.js    

```
*/

var fs = require('fs');
var stockNoJson = JSON.parse(fs.readFileSync('StockNo.json', 'utf8'));

function checkStockNo(s_no){
    for(var i=0 ;i < stockNoJson.data.length;i++){
        if(stockNoJson.data[i][0]==s_no){
            return true;
        }
    }
    return false;
}

console.log(checkStockNo(1010));