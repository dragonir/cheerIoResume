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
            cookie: "_ga=GA1.2.517660036.1536892542; user_trace_token=20180914103541-df2b4de9-b7c6-11e8-b939-5254005c3644; LGUID=20180914103541-df2b5332-b7c6-11e8-b939-5254005c3644; index_location_city=%E5%85%A8%E5%9B%BD; _gid=GA1.2.946790302.1537236741; ab_test_random_num=0; hasDeliver=0; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; JSESSIONID=ABAAABAAAGGABCBD269C47FEBFBEDA36175E113888065CC; _putrc=E79A7F84FB6D775A123F89F2B170EADC; login=true; unick=%E6%8B%89%E5%8B%BE%E7%94%A8%E6%88%B72800; TG-TRACK-CODE=index_resume; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1537236742,1537241770,1537323716,1537330926; gate_login_token=1bd96b2b90990ada7ce17bedcd144cba277234b2a76baefa921428a552fb1b78; _gat=1; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1537338393; LGSID=20180919142634-f44bbaa3-bbd4-11e8-baf2-5254005c3644; PRE_UTM=; PRE_HOST=; PRE_SITE=; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Fresume%2Fpreview.html; LGRID=20180919142634-f44bbefd-bbd4-11e8-baf2-5254005c3644"
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
            
            saveInfo();
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
    console.log(params)
    http.request(options,  res => {
        console.log(res);
    })
}