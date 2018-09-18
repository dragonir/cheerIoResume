var http = require("https");
var cheerio = require("cheerio");
var req,
    options,
    SERVER_URL = "//recruit.21cn.com",
    candidateInfo = {}, 
    educationList = {},
    clubList = {},
    practicalList = {};
getData();

function getData(){
    options = {
        hostname:'www.lagou.com',
        port: null,
        path:'/resume/preview.html',    
        method:'GET',
        headers: {
            cookie: "WEBTJ-ID=09182018%2C204536-165ecb6eee3abb-0d57e5e090bf33-1130685c-1296000-165ecb6eee42c0; user_trace_token=20180918204549-2cfc70d5-5119-48a9-93fa-e7bf1d227fbb; X_HTTP_TOKEN=24729d6877c5772261906a98f39ea1c5; LGSID=20180918204550-c5bf2332-bb40-11e8-baf2-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=https%3A%2F%2Fwww.lagou.com%2Flp%2Fhtml%2Fcommon.html%3Futm_source%3Dm_cf_cpc_baidu_pc%26m_kw%3Dbaidu_cpc_gz_3214b8_894875_%25E5%2589%258D%25E7%25A8%258B%25E6%2597%25A0%25E5%25BF%25A7%25E6%258B%259B%25E8%2581%2598%25E7%25BD%2591%25E6%259C%2580%25E6%2596%25B0%25E6%258B%259B%25E8%2581%2598; PRE_LAND=https%3A%2F%2Fpassport.lagou.com%2Flogin%2Flogin.html%3Fservice%3Dhttps%253a%252f%252fwww.lagou.com%252f; LGUID=20180918204550-c5bf25e2-bb40-11e8-baf2-5254005c3644; LG_LOGIN_USER_ID=e587a0485bba7f546c155a7eb41c74b230d0be776c26d0b3dcc1e600b64394d7; _putrc=E79A7F84FB6D775A123F89F2B170EADC; JSESSIONID=ABAAABAAAIAACBIE82DE5B4C60F48DD703E7E21CB795D5E; login=true; unick=test; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=0; gate_login_token=ff56e34e3a3b36d01a90b5ccf7b38594c5244106b3820425aca3b96e2760ef60; index_location_city=%E5%85%A8%E5%9B%BD; _ga=GA1.2.53206537.1537274787; _gat=1; TG-TRACK-CODE=index_resume; LGRID=20180918204645-e66096c6-bb40-11e8-a1fb-525400f775ce"
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
            candidateInfo.candidateId = "",
            candidateInfo.name = $(".mr_p_name .mr_name").text();
            candidateInfo.sex = $(".base_info em.s").text();
            candidateInfo.phone = $(".mobile").text();
            candidateInfo.email = $(".email em").text();
            var ageStr = $(".base_info em.a").text();
            candidateInfo.age = getCndidateAge(ageStr);
            candidateInfo.idcard = "";
            candidateInfo.politicalAffiliation = "";
            candidateInfo.desiredSalary = "";
            candidateInfo.maritalState = "";
            candidateInfo.bearState = "";
            candidateInfo.nation = "";
            candidateInfo.nativePlace = "";
            candidateInfo.hobby = $("#selfDescription .mr_moudle_content .mr_self_r p").text();
            candidateInfo.refereeName = "";
            candidateInfo.certificate = "";
            candidateInfo.englishLevel = "";
            candidateInfo.englishScore = "";
            candidateInfo.jobSkill = "";
            candidateInfo.opusUrl = $("#socialPage .social-page__list li:first-child a span").text();
            candidateInfo.awardList = "";
           
            educationList.schoolName = $("#educationalBackground .mr_content_l .l2 h4").text();
            var degree = $("#educationalBackground .mr_content_l .l2 span").text();
            educationList.degreeId = getDegreeId(degree);
            var educationTimeStr = $("#educationalBackground .mr_content_r span").text();
            educationList.startTime =  getEducationStartTime(educationTimeStr);
            educationList.endTime = getEducationEndTime(educationTimeStr);
            educationList.specialty = getEducationSpecialty(degree);
            educationList.rank = "";
            educationList.score = "";
            educationList.aveScore = "";
            educationList.degree = "";
            educationList.course = "";
            
            practicalList.practicalCompany = $("#workExperience .mr_content_l .l2 h4").text();
            var practicalTimeStr = $("#workExperience .mr_content_r span").text();
            practicalList.practicalStartTime = getPracticalStartTime(practicalTimeStr);
            practicalList.practicalEndTime = getpracticalEndTime(practicalTimeStr);
            practicalList.practicalDepartment = "";
            practicalList.decription = $("#workExperience .mr_content_m p").text();
            practicalList.practicalJob = $("#workExperience .mr_content_l .l2 span").text();
            
            clubList.clubCompany = "";
            clubList.clubDepartment = "";
            clubList.decription = "";
            clubList.clubStartTime = "";
            clubList.clubEndTime = "";
            clubList.clubJob = "";
            printData();
        });
    });
    req.setTimeout(5000,function(){
        req.abort();
    });
    req.on('error',function(err){
        if(err.code=="ECONNRESET"){
            console.log('socket端口连接超时。');
        }else{
            console.log('请求发生错误，err.code:'+err.code);
        }
    });
    req.end();
}

function printData(){
    console.log(candidateInfo);
    console.log(educationList);
    console.log(practicalList);
    console.log(clubList);
}

function getDegreeId(str){
    var _str = str.substring(0,2);
    var ans = 0;
    switch(_str){
        case "大专":
            ans = 0;
            break;
        case "本科":
            ans = 1;
            break;
        case "硕士":
            ans = 2;
            break;
        case "博士":
            ans = 3;
            break;
        default:
            ans = 4;
            break;
    }
    return ans;
}
function getCndidateAge(str){
    var _age = str.substring(0, str.length-1);
    return _age;
}
function getEducationStartTime(str){
    var _str = str.substring(0, 4);
    var startTime = new Date(_str);
    return startTime;
}
function getEducationEndTime(str){
    var _str = str.substring(8, 12);
    var endTime = new Date(_str);
    return endTime;
}
function getEducationSpecialty(str){
    return str.split("").slice(5, str.length).join("");
}
function getPracticalStartTime(str){
    var _str = str.substring(0, 7);
    return new Date(_str);
}
function getpracticalEndTime(str){
    var _str = str.substring(10, 17);
    return new Date(_str);
}

function savePersonInfo(){
    var personInfo = {
        candidateId: candidateInfo.candidateId,
        name: candidateInfo.name,
        sex: candidateInfo.sex,
        phone: candidateInfo.phone,
        email: candidateInfo.email,
        age: candidateInfo.age,
        idcard: candidateInfo.idcard,
        politicalAffiliation: candidateInfo.politicalAffiliation,
        desiredSalary: candidateInfo.desiredSalary,
        maritalState: candidateInfo.maritalState,
        bearState: candidateInfo.bearState,
        nation: candidateInfo.nation,
        nativePlace: candidateInfo.nativePlaceId,
        hobby: candidateInfo.hobby,
        refereeName: candidateInfo.refereeName
    }
    http.post(SERVER_URL + "/api/resume/saveInfo.do", {
        params: personInfo
    }, function(res){
        if(res.result !== 200){}
        else{}
    }, function(err){

    })
}

function saveEducationInfo(){
    var educationInfo = {
        candidateId: candidateInfo.candidateId,
        educationList: educationList,
        englishLevel: candidateInfo.englishLevel,
        englishScore: candidateInfo.englishScore,
        certificate: candidateInfo.certificate
    }
    http.post(SERVER_URL + "/api/resume/saveEducationInfo.do", {
        params: educationInfo
    }, function(res){

    }, function(err){

    })
}

function saveSkillInfo(){
    var skillInfo = {
        candidateId: candidateInfo.candidateId,
        clubList: clubList,
        practicalList: practicalList,
        awardList: candidateInfo.awardList,
        opusUrl: candidateInfo.opusUrl
    }
    http.post(SERVER_URL + "/api/resume/saveActualCombat.do" , {
        params: skillInfo
    }, function(res){

    }, function(err){

    })
}