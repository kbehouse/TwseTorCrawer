var ary = ['12033','1201', '00666R','910322','2312','1203','4821','9103R'];
for(var i=0 ;i < ary.length;i++){
    var stock = ary[i];
    //l(stock[0] + ' stock[0].length='+stock[0].length);
    if(stock.length>4){
        //remove this item
        console.log('Remove ' + stock);
        ary.splice(i,1);
        console.log(ary);
        i--;
    }
}
console.log(ary);