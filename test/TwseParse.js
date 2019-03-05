var fs = require('fs');

var l = console.log;
// async
// fs.readFile('2030/2036.json', 'utf8', function (err, data) {
//     if (err) throw err; // we'll not consider error handling for now
//     var obj = JSON.parse(data);
// });

// sync
var fs = require('fs');
var json = JSON.parse(fs.readFileSync('2000/2036.json', 'utf8'));

l(json);
l(json.stat);

var text = '{ "sites" : [' +
    '{ "name":"Runoob" , "url":"www.runoob.com" },' +
    '{ "name":"Google" , "url":"www.google.com" },' +
    '{ "name":"Taobao" , "url":"www.taobao.com" } ]}';
    
obj = JSON.parse(text);
l(obj);
l( obj.sites[1].name);