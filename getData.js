// 一旦Cheerio安装完成， 我们就可以开始工作了。 首先让我们来看一段javascript代码 这段代码可以下载任意一个网页的内容。
var http = require("http");
 
// Utility function that downloads a URL and invokes
// callback with the data.

function download(url, callback) {

  http.get(url, function(res) {

    var data = "";

    res.on('data', function (chunk) {

      data += chunk;

    });

    res.on("end", function() {

      callback(data);

    });

  }).on("error", function() {

    callback(null);

  });
}

var cheerio = require("cheerio");
 

// var url = "http://www.echojs.com/";
// var url = "http://developers.weixin.qq.com/miniprogram/product/index.html?t=18090422";
var url = "http://www.shixiseng.com/trainee/onresume/modify/res_u6nqjgwucfsa";


download(url, function(data) {

  if (data) {

    // console.log(data);

    var $ = cheerio.load(data);

    // $("article").each(function(i, e) {

    //   var link = $(e).find("h2>a");

    //   var poster = $(e).find("username").text();

    //   console.log(poster+": ["+link.html()+"]("+link.attr("href")+")");

    // });

  	$(".module-item").each(function(i, e) {
      var b = $(e).find("div.module-name b");
      console.log(b);

    });


	$("section").each(function(i, e) {
      	var p = $(e).find("p");
      	console.log(i + "\n\n" + p.text() + "\n");

    });





  }
});