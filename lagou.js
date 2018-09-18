var http = require("https");
var cheerio = require("cheerio");
var fs = require('fs');
var outstream = fs.createWriteStream('./output.csv');

// 请求并获得数据
var req;
var options;
var SERVER_URL = "//recruit.21cn.com";
var cheerData = {}
getData();
function getData(){
    options = {
        hostname:'www.lagou.com',
        port: null,
        path:'/resume/preview.html',    
        method:'GET',
        headers: {
            cookie: "_ga=GA1.2.517660036.1536892542; user_trace_token=20180914103541-df2b4de9-b7c6-11e8-b939-5254005c3644; LGUID=20180914103541-df2b5332-b7c6-11e8-b939-5254005c3644; index_location_city=%E5%85%A8%E5%9B%BD; _gid=GA1.2.946790302.1537236741; ab_test_random_num=0; hasDeliver=0; WEBTJ-ID=20180918113609-165eabfe6a8c62-02e91ae17ebfb1-5e442e19-2073600-165eabfe6aa429; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1536892542,1537236742,1537241770; _putrc=E79A7F84FB6D775A123F89F2B170EADC; JSESSIONID=ABAAABAAAIAACBI11C1D7B538FC83B5CD8DCE1D02540528; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B72800; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; TG-TRACK-CODE=index_resume; gate_login_token=475c98328963626de7baa4d122dcf06a31e1293b23eacb7d444ac687c0d53a72; LGSID=20180918181003-02470f06-bb2b-11e8-a1f3-525400f775ce; PRE_UTM=; PRE_HOST=; PRE_SITE=; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fresume%2Fmyresume.html; _gat=1; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1537265602; LGRID=20180918181321-7881b48d-bb2b-11e8-baf2-5254005c3644"
        }
    };
    req = http.request(options, function(resp){
        resp.setEncoding('utf8');
        var body = "";
        resp.on('data',function(chunk){
            body += chunk;            
        });
        resp.on('end',function(){
            var $ = cheerio.load(body);
            var test = $(".mobile").text();
            console.log(test);
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
}

var personInfo = {
    candidateId: cheerData.candidateId,
    name: cheerData.name,
    sex: cheerData.sex,
    phone: cheerData.phone,
    email: cheerData.email,
    age: cheerData.age,
    idcard: cheerData.idcard,
    politicalAffiliation: cheerData.politicalAffiliation,
    desiredSalary: cheerData.desiredSalary,
    maritalState: cheerData.maritalState,
    bearState: cheerData.bearState,
    nation: cheerData.nation,
    nativePlace: cheerData.nation,
    hobby: cheerData.hobby,
    refereeName: cheerData.refereeName
}

function savePersonInfo(){
    http.post(SERVER_URL + "/api/resume/saveInfo.do", {
        params: personInfo
    }, function(res){
        if(res.result !== 200){}
        else{}
    }, function(err){

    })
}

var educationInfo = {
    candidateId: cheerData.candidateId,
    educationList: cheerData.educationList,
    englishLevel: cheerData.englishLevel,
    englishScore: cheerData.englishScore,
    certificate: cheerData.certificate
}

function saveEducationInfo(){
    http.post(SERVER_URL + "/api/resume/saveEducationInfo.do", {
        params: educationInfo
    }, function(res){

    }, function(err){

    })
}

var skillInfo = {
    candidateId: cheerData.candidateId,
    clubList: cheerData.clubList,
    practicalList: cheerData.practicalList,
    awardList: cheerData.awardList,
    opusUrl: cheerData.opusUrl
}

function saveSkillInfo(){
    http.post(SERVER_URL + "/api/resume/saveActualCombat.do" , {
        params: skillInfo
    }, function(res){

    }, function(err){

    })
}