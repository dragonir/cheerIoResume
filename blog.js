// 内置http模块，提供了http服务器和客户端功能
var http=require("http");

// cheerio模块，提供了类似jQuery的功能
var cheerio = require("cheerio");

// 内置文件处理模块
var fs=require('fs');

// 创建一个将流数据写入文件的WriteStream对象
var outstream=fs.createWriteStream('./output.csv');

// 请求参数JSON
var options;

// 请求并获得数据
var req;

// 存储页码
var index = 1;

function findTitlesInPage(pageNumber){
    console.log("开始读取第"+pageNumber+"页");

    options={
        hostname:'www.cnblogs.com',// 这里别加http://，否则会出现ENOTFOUND错误
            port:80,
            path:'/xiandedanteng/p/?page='+pageNumber,// 子路径
          method:'GET',
    };
    
    req=http.request(options, function(resp){
        resp.setEncoding('utf8');
        var body="";

        resp.on('data',function(chunk){
            body+=chunk;            
        });

        resp.on('end',function(){
            var $ = cheerio.load(body);

            // 查找所有class为postTitl2的节点下面的a节点（链接），用了cheerio能少些正则表达式及匹配代码
            $(".postTitl2 a").each(function(index,element){
                var text=$(element).text();
                console.log(text);
                outstream.write(pageNumber+','+text + '\n','utf8');
            })            
        });
    });

    // 超时处理
    req.setTimeout(5000,function(){
        req.abort();
    });

    // 出错处理
    req.on('error',function(err){
        if(err.code=="ECONNRESET"){
            console.log('socket端口连接超时。');
        }else{
            console.log('请求发生错误，err.code:'+err.code);
        }
    });

    // 请求结束
    req.end();

    // 51页调完为止
    if(index<51){        
        index++;
        console.log('继续第'+index+'页');
        start(index);
    }
}

// 包一层函数
function start(i){
    findTitlesInPage(i);
}

// 开始遍历
start(index);