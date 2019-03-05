
from os import system

for i in range(1,10):
    port     = 8000 + i*10
    stock_start = i*1000      
    stock_end = i*1000 + 999      
    cmd="node TwseTorCrawer.js -p {} -s {} -e {} > port_{}.log & " \
            .format(port, stock_start, stock_end, port)

    print(cmd)
    system(cmd)