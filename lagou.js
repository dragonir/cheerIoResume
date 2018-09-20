var http = require("https");
var cheerio = require("cheerio");
var req,
    options,
    SERVER_URL = "//recruit.21cn.com",
    candidateInfo = {}, 
    educationList = [{}],
    clubList = [{}],
    practicalList = [{}];
getData();
function getData(){
    options = {
        hostname:'www.lagou.com',
        port: null,
        path:'/resume/preview.html',    
        method:'GET',
        headers: {
            cookie: "Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1537416685; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1537416434; LGRID=20180920121124-3d34afa3-bc8b-11e8-baf2-5254005c3644; LGSID=20180920120711-a674d718-bc8a-11e8-a26b-525400f775ce; _ga=GA1.2.1011689793.1537416432; _gid=GA1.2.1743051029.1537416432; unick=%E7%8E%8B%E6%96%8C; TG-TRACK-CODE=index_resume; index_location_city=%E5%85%A8%E5%9B%BD; LG_LOGIN_USER_ID=200760eda259743f445048710fe6e90cf1a263a7a7391310dc339f03b16ddf0c; _putrc=E79A7F84FB6D775A123F89F2B170EADC; gate_login_token=fa330b70241a5a494b246f2de5f5e06362736969115cb6235015b812c2ebbf55; login=true; JSESSIONID=ABAAABAAAGGABCBAC43F41224B8C4F12F47421CFA5C9A32; hasDeliver=0; showExpriedCompanyHome=1; showExpriedIndex=1; showExpriedMyPublish=1; X_HTTP_TOKEN=5acd485755eef553cde6c6c8501ed4ee; LGUID=20180920120711-a674d87b-bc8a-11e8-a26b-525400f775ce; PRE_HOST=; PRE_LAND=; PRE_SITE=; PRE_UTM=; _gat=1; user_trace_token=20180920120711-a674d636-bc8a-11e8-a26b-525400f775ce; WEBTJ-ID=09202018%2C120711-165f52907e730b-02df82aed92a0a8-49183707-1296000-165f52907e8a5b"
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
            candidateInfo.name = $(".mr_p_name .mr_name").text().trim();
            candidateInfo.sex = $(".base_info em.s").text().trim();
            candidateInfo.phone = $(".mobile").text().trim();
            candidateInfo.email = $(".email em").text().trim();
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
            candidateInfo.photo = $("#baseinfo .mr_headimg:first-child").attr("src")
           
            educationList[0].schoolName = $("#educationalBackground .mr_content_l .l2 h4").text();
            var degree = $("#educationalBackground .mr_content_l .l2 span").text();
            educationList[0].degreeId = getDegreeId(degree);
            var educationTimeStr = $("#educationalBackground .mr_content_r span").text();
            educationList[0].startTime =  getEducationStartTime(educationTimeStr);
            educationList[0].endTime = getEducationEndTime(educationTimeStr);
            educationList[0].specialty = getEducationSpecialty(degree);
            educationList[0].rank = "";
            educationList[0].score = "";
            educationList[0].aveScore = "";
            educationList[0].degree = "";
            educationList[0].course = "";
            
            practicalList[0].practicalCompany = $("#workExperience .mr_content_l .l2 h4").text();
            var practicalTimeStr = $("#workExperience .mr_content_r span").text();
            practicalList[0].practicalStartTime = getPracticalStartTime(practicalTimeStr);
            practicalList[0].practicalEndTime = getpracticalEndTime(practicalTimeStr);
            practicalList[0].practicalDepartment = "";
            practicalList[0].decription = $("#workExperience .mr_content_m p").text();
            practicalList[0].practicalJob = $("#workExperience .mr_content_l .l2 span").text();
            
            clubList[0].clubCompany = "";
            clubList[0].clubDepartment = "";
            clubList[0].decription = "";
            clubList[0].clubStartTime = "";
            clubList[0].clubEndTime = "";
            clubList[0].clubJob = "";
            
            saveInfo();
            // printData();
        });
    });
    req.setTimeout(5000,function(){
        req.abort();
    });
    req.on('error',function(err){
        if(err.code == "ECONNRESET"){
            console.log('socket端口连接超时。');
        }
        else{
            console.log('请求发生错误，err.code:'+err.code);
        }
    });
    req.end();
}

function printData(){
    console.log(candidateInfo);
    console.log(educationList);
    console.log(clubList);
    console.log(practicalList);
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
    return dateFormat(startTime);
}
function getEducationEndTime(str){
    var _str = str.substring(8, 12);
    var endTime = new Date(_str);
    return  dateFormat(endTime);
}
function getEducationSpecialty(str){
    return str.split("").slice(5, str.length).join("");
}
function getPracticalStartTime(str){
    var _str = str.substring(0, 7);
    return dateFormat(new Date(_str));
}
function getpracticalEndTime(str){
    var _str = str.substring(10, 17);
    return  dateFormat(new Date(_str));
}
function dateFormat(str){
    month = '' + (str.getMonth() + 1),
    day = '' + str.getDate(),
    year = str.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
}

function saveInfo(){
    var params = {
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
        refereeName: candidateInfo.refereeName,
        photo: candidateInfo.photo,
        educationList: educationList,
        englishLevel: candidateInfo.englishLevel,
        englishScore: candidateInfo.englishScore,
        certificate: candidateInfo.certificate,
        clubList: clubList,
        practicalList: practicalList,
        awardList: candidateInfo.awardList,
        bigOpusUrl: candidateInfo.opusUrl
    }

    var options = {
        hostname: 'localhost',
        port: 9999,
        path: '/api/client/importResume',
        method: 'POST',
        cookies: "jobName=Java%E5%BC%80%E5%8F%91",
        data: {params}
    }
    console.log(JSON.stringify(params));
    // http.request(options,  res => {
    //     console.log(res);
    // })
}