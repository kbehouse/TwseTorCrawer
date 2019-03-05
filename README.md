# Clean Bookmark

Crawler for TWSE (TaiWan Stock Exchange)

## Install

```
yarn
```
## Get all stock number

following command will get StockNo.json
```
node getAllStockNo.js
```

## Tor Client 

Tor Client  install, 
Refer: [tor-request](https://www.npmjs.com/package/tor-request)

Debian/Ubuntu
```
sudo apt-get install tor # should auto run as daemon after install 
```

OSX
```
brew install tor
tor # run tor 
```

## Get History Index

Get stock number from 1000 to 1999
```
node TwseTorCrawer.js -p 9010 -s 1000 -e 1999
```

Get all sotck's history index 
```
python gen_catch_stock_index.py
```
