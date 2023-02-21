const express = require('express');
var app = express();
const fs = require("fs");
const request = require('request')
const openai = require("openai");

// var ENV_SERVER = "http://127.0.0.1:3000/"
var ENV_SERVER = "https://demo-deploy-app-01.onrender.com/"

const html = fs.readFileSync('index.html', 'utf8');
const API_ID = "c5695b69-579a-42b9-9791-5730b9c82cb8"
const API_KEY = "e3faa319-e781-414c-a768-7a00b873832a"

const puppeteer = require('puppeteer');
const AWS = require('aws-sdk');


// init openAPI
const Configuration = openai.Configuration;
const OpenAIApi = openai.OpenAIApi;

let key = "sk-TSz275JV5fMrM1jCpV5XT3BlbkFJLblwOpYhW2lBwPud"
let key2 = "6BT0"
const configuration = new Configuration({
    organization: "org-kZkL4Z0rkGFT2U9PH5n4aBJy",
    apiKey: key + key2,
});
// console.log(process.env.OPENAI_API_KEY)
const openaiObj = new OpenAIApi(configuration);


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

team_member = {
    "Anh Nguyen Viet 6": {
        "email": "anh.nguyenviet6",
        "name": "anh.nguyenviet6",
        "alias": "vietanh6"
    },
    "Quy Nguyen Ngoc": {
        "email": "quy.nguyenngoc",
        "name": "quy.nguyenngoc",
        "alias": "quynn"
    },
    "Duc Luu Trong": {
        "email": "duc.luutrong",
        "name": "duc.luutrong",
        "alias": "ducdoo"
    },
    "Trung Mai Duc 2": {
        "email": "trung.maiduc2",
        "name": "trung.maiduc2",
        "alias": "trungtrau"
    },
    "Minh Nguyen Chinh": {
        "email": "minh.nguyenchinh",
        "name": "minh.nguyenchinh",
        "alias": "chinhminh"
    },
    "Giang Trinh Thuy": {
        "email": "giang.trinhthuy",
        "name": "giang.trinhthuy",
        "alias": "alextrinh"
    },
    "Anh Bui Thi Ngoc": {
        "email": "anh.buithingoc",
        "name": "anh.buithingoc",
        "alias": "ngocanh"
    }
}

const port = process.env.PORT || 3000
const data_path = "./member_data.json";

function getUserDataFromFile() {

    let readDataStr = ""
    let readDataJson = ""
    try {
        readDataStr = fs.readFileSync('./member_data.json', 'utf8')
        readDataJson = JSON.parse(readDataStr)
    } catch (err) {
    }

    return readDataJson
}

function getMemberMissingRecord() {
    let missingRec = []
    let membersData = getUserDataFromFile()
    for (var member of Object.keys(team_member)) {
        team_member_email = team_member[member]["email"]
        number_records = 0
        if (!membersData[getCurrentDate()][team_member_email]) {
            console.log(team_member[member]["email"])
            missingRec.push(team_member[member]["email"])
        }
    }
    return missingRec
}

function getCurrentDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`
}

function getDestinationMMUrl() {
    return 'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a'
    // return 'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa'
}


//
function getNumRecords() {
    let all_data = getUserDataFromFile()

    let all_records = {}

    for (var member of Object.keys(team_member)) {
        team_member_email = team_member[member]["name"]
        number_records = 0
        for (var date of Object.keys(all_data)) {
            // console.log(date)
            if (all_data[date][team_member[member]["name"]]) {
                number_records += 1
            }
        }
        all_records[team_member[member]["alias"]] = number_records

    }
    // console.log(console.log(JSON.stringify(all_records, null, 3)))

    console.log("getNumRecords return:")
    console.log(console.log(JSON.stringify(all_records, null, 3)))

    var sortedData = Object.entries(all_records).sort((a, b) => b[1] - a[1]);

    const result = sortedData.reduce((acc, item) => {
        acc[item[0]] = item[1];
        return acc;
    }, {});


    console.log("result===");
    console.log(result);

    return result
}

function getUserScore() {
    let all_data = getUserDataFromFile()

    let all_records = {}

    let highest_record = 0
    for (var member of Object.keys(team_member)) {
        team_member_email = team_member[member]["name"]
        number_records = 0
        score = 0
        for (var date of Object.keys(all_data)) {
            // console.log(date)
            if (all_data[date][team_member[member]["name"]]) {
                score += all_data[date][team_member[member]["name"]]["score"]
                number_records += 1
            }
        }
        if (highest_record < number_records) {
            highest_record = number_records
        }
        all_records[team_member[member]["alias"]] = {}
        all_records[team_member[member]["alias"]]["score"] = (score / number_records).toFixed(2)
        all_records[team_member[member]["alias"]]["num_records"] = number_records

    }
    console.log("aall records")
    console.log(highest_record)
    console.log(console.log(JSON.stringify(all_records, null, 3)))


    final_score = {}
    for (var member of Object.keys(all_records)) {
        // console.log(member)
        final_score[member] = 0.7 * (all_records[member]["score"]) + 0.3 * (10 * all_records[member]["num_records"] / highest_record)
    }

    console.log(final_score)
    console.log("getNumRecords return:")
    console.log(console.log(JSON.stringify(final_score, null, 3)))

    var sortedData = Object.entries(final_score).sort((a, b) => b[1] - a[1]);

    const result = sortedData.reduce((acc, item) => {
        acc[item[0]] = item[1];
        return acc;
    }, {});


    console.log("result===");
    console.log(result);

    return result
    // return number_records
}


async function sendChartAsImage(chartName, chartType) {
    console.log("prepare capturing 5")

    ACCESS_KEY_1 = "AKIA6JEDQFAH5UBN"
    ACCESS_KEY_2 = "Z75K"
    ACCESS_KEY_ID = ACCESS_KEY_1 + ACCESS_KEY_2

    SECRET_KEY_1 = "HMH+hRFDQKCdR4cOleJr9KqqfueaOxdanzn"
    SECRET_KEY_2 = "NgwnR"
    SECRET_ACCESS_KEY = SECRET_KEY_1 + SECRET_KEY_2

    const width = 600; //px
    const height = 400; //px
    const backgroundColour = 'white';
    const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });
    // Define the chart options
    const options = {
        plugins: {
            title: {
                display: true,
                text: chartName
            }
        },
        indexAxis: 'y',
        scales: {
            xAxes: [
                {
                    type: "3d",
                    position: "bottom",
                    gridLines: {
                        drawOnChartArea: false
                    }
                }
            ],
            yAxes: [
                {
                    type: "linear",
                    position: "left",
                    gridLines: {
                        drawOnChartArea: false
                    }
                }
            ]
        },
        animation: {
            duration: 2000,
            easing: "easeOutQuart"
        }
    };
    var myLabel = []
    var myLabelName = 'Nums of Reports'
    var myLabelRecords = []
    var myLabelRecordsBackground = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(177, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(67, 111, 64, 0.2)',
        'rgba(22, 11, 64, 0.2)',
    ]
    var myLabelRecordsBorder = [
        'rgba(255, 99, 132, 1)',
        'rgba(177, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(67, 111, 64, 1)',
        'rgba(22, 11, 64, 1)',
    ]

    if (chartType == SCORE_CHART_TYPE) {
        recoredData = getUserScore()
        myLabelName = 'Scores'
    } else if (chartType == REPORT_CHART_TYPE) {
        recoredData = getNumRecords()
        myLabelName = 'Reports'
    }

    for (var name of Object.keys(recoredData)) {
        myLabel.push(name)
        myLabelRecords.push(recoredData[name])
    }
    const configuration2 = {
        type: 'bar',
        data: {
            labels: myLabel,
            datasets: [{
                label: myLabelName,
                data: myLabelRecords,
                backgroundColor: myLabelRecordsBackground,
                borderColor: myLabelRecordsBorder,
                borderWidth: 1
            }]
        },
        options: options
    };

    const bufferImg = await chartJSNodeCanvas.renderToBuffer(configuration2);

    AWS.config.update({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
        region: 'ap-northeast-1'
    });

    // Create an S3 instance
    const s3 = new AWS.S3();
    // const file = fs.readFileSync('screenshot.png');
    const uploadParams = {
        Bucket: 'myvietanhbot3',
        Key: 'screenshot.png',
        Body: bufferImg,
        ContentType: 'image/png'
    }
    var signUrlParams = {
        Bucket: 'myvietanhbot3',
        Key: 'screenshot.png',
        Expires: 600 // URL will expire in 60 seconds
    };

    const waitForAllFunctions = async () => {
        let url_img
        const signedUrlPromise = new Promise((resolve, reject) => {
            s3.getSignedUrlPromise('getObject', signUrlParams, function (err, url) {
                if (err) {
                    reject(err);
                } else {
                    console.log('The URL for the image is: ', url);
                    var request = require('request');
                    request.post(
                        getDestinationMMUrl(),
                        { json: { "text": url } },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                            } else {
                                console.log("got error")
                            }
                        }
                    );
                    url_img = url
                    resolve(url);
                }
            });
        });

        const results = await Promise.all([
            s3.upload(uploadParams).promise(),
            signedUrlPromise
        ]);

        console.log(results);
        console.log(url_img);
        return url_img
    };

    return await waitForAllFunctions();
}

function convertToEmail(list) {
    var email_list = []
    list.forEach(getEmail)
    function getEmail(name) {
        if (team_member[name] != null) {
            email_list.push(team_member[name]["email"])
        }
    }
    console.log("email_list")
    console.log(email_list.toString())
    return email_list.toString()
}

function getRecords() {
    let missRec = []
    let doneRec = []
    let membersData = getUserDataFromFile()
    for (var member of Object.keys(team_member)) {
        team_member_email = team_member[member]["name"]
        number_records = 0
        if (!membersData[getCurrentDate()][team_member_email]) {
            console.log(team_member[member]["name"])
            missRec.push(team_member[member]["name"])
        } else {
            console.log(team_member[member]["name"])
            doneRec.push(team_member[member]["name"])
        }
    }
    let rec_today = {}
    rec_today["miss"] = missRec
    rec_today["done"] = doneRec
    console.log(console.log(JSON.stringify(rec_today, null, 3)))
    return rec_today
}

async function sendReport(jsonData) {
    if (jsonData.text.startsWith("Reporting")) {
        console.log(jsonData.text)
        var membersData = jsonData.text.split('\n');
        var myname = ""

        // No Raven
        var myData = {}

        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = `${year}-${month}-${day}`;

        myData[currentDate] = {}

        console.log("Parsing data")
        const reName = /(Reporting for)(.*)/;
        const reReports = /(.*)/
        membersData.forEach(readData)
        function readData(value, index, array) {
            console.log("value222")
            console.log(value)
            if (filters = value.match(reName)) {
                console.log("Parsing data 1")
                console.log(filters[1])
                console.log(filters[2])
                myname = jsonData.user_name
                myData[currentDate][myname] = {}
            } else if (filters = value.match(reReports)) {
                console.log("Parsing data 2")
                console.log(myname)
                console.log(myData[currentDate][myname]["reports"])
                console.log(filters[0])

                if (myname != "" && !myData[currentDate][myname]["reports"]) myData[currentDate][myname]["reports"] = [];
                myData[currentDate][myname]["reports"].push(filters[0])
            }
        }

        console.log("\nShow myData")
        console.log('myData : %j', myData);

        const fs = require('fs');
        let readDataStr = ""
        let readDataJson = {}
        try {
            readDataStr = fs.readFileSync(data_path, 'utf8');
            readDataJson = JSON.parse(readDataStr);
        } catch (err) {
            console.log("have error")
        }



        console.log("merging....1");
        // console.log(JSON.stringify(readDataJson, null, 3));
        // console.log(JSON.stringify(myData, null, 3));
        const JSONObjectMerge = require("json-object-merge");
        const merged = JSONObjectMerge.default(readDataJson, myData);
        console.log("merging....2");
        console.log(JSON.stringify(merged, null, 3));

        if (fs.existsSync(data_path)) {
            // path exists
            const myJSON = JSON.stringify(merged, null, 3);
            fs.writeFileSync(data_path, myJSON, (err) => {
                // In case of a error throw err.
                if (err) throw err;
                console.log("exists:3", data_path);
                console.log("vietanh git 3");
                var execProcess = require("./exec_process.js");
                execProcess.result("sh temp.sh", function (err, response) {
                    console.log("aaa")
                    if (!err) {
                        console.log("1")
                        console.log(response);
                    } else {
                        console.log("2")
                        console.log(err);
                    }
                });
            })
        }

        let msg = ""
        // console.log("vietanh test Give me")
        // console.log(myData[currentDate][myname]["reports"])
        // console.log(merged[currentDate][myname]["reports"])
        let myQuest = {
            "model": "text-davinci-003",
            // "prompt": "Say thank the report of " + myname + "?",
            "prompt": "Give me a short explain of the report: " + myData[currentDate][myname]["reports"] + "?",
            "max_tokens": 1000,
            // "temperature": 0,
            "top_p": 0.2,
            "n": 1,
            "stream": false,
            "logprobs": null,
        }
        try {
            const completion = await openaiObj.createCompletion(myQuest);
            console.log(completion.data.choices[0].text);
            // msg = completion.data.choices[0].text
            msg = ""
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }

        // let myQuest2 = {
        //     "model": "text-davinci-003",
        //     "prompt": "Say thank the report of " + myname + "?" + "say wish me a good working day",
        //     "max_tokens": 1000,
        //     // "temperature": 0,
        //     "top_p": 0.9,
        //     "n": 1,
        //     "stream": false,
        //     "logprobs": null,
        // }
        // try {
        //     const completion = await openaiObj.createCompletion(myQuest2);
        //     console.log(completion.data.choices[0].text);
        //     msg += completion.data.choices[0].text
        // } catch (error) {
        //     if (error.response) {
        //         console.log(error.response.status);
        //         console.log(error.response.data);
        //     } else {
        //         console.log(error.message);
        //     }
        // }
        // var request = require('request');
        // request.post(
        //     getDestinationMMUrl(),
        //     { json: { "text": msg } },
        //     function (error, response, body) {
        //         if (!error && response.statusCode == 200) {
        //             console.log(body);
        //         } else {
        //             console.log("got error")
        //         }
        //     }
        // );
    }
}
async function sendDailyRemind(jsonData) {
    console.log("sendDailyRemind")
    let msg = ""

    let myQuest = {
        "model": "text-davinci-003",
        "prompt": "hello bot",
    }
    try {
        const completion = await openaiObj.createCompletion(myQuest);
        let myQuest2 = {
            "model": "text-davinci-003",
            // "prompt": "I'm Dragon Mania Legends China, Help me give my teammates reminder that \"you need to fill out the daily task today\"",
            "prompt": "On behalf of \"Dragon Mania Legends China Team\". Help me say hi and a polite reminder email to my friends that \"you need to fill out the daily task today\"",
            "max_tokens": 1000,
            // "temperature": 0,
            "top_p": 0.5,
            "n": 1,
            "stream": false,
            "logprobs": null,
            // "stop": "\n",
        }
        try {
            const completion = await openaiObj.createCompletion(myQuest2);
            console.log(completion.data.choices[0].text);
            msg = completion.data.choices[0].text
            msg = "# " + msg.trim()
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }


    var request = require('request');
    request.post(
        getDestinationMMUrl(),
        { json: { "text": msg } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log("got error")
            }
        }
    );
}

async function sendThank(jsonData) {
    console.log("sendThank")
    let msg = ""
    let rec = getRecords();
    let myQuest = {
        "model": "text-davinci-003",
        "prompt": "On behalf of \"Dragon Mania Legends China Team\". Send a short email to thank my team for reporting" + " then warning " + rec["miss"] + " because missing daily report.",
        "max_tokens": 1000,
        // "temperature": 0,
        "top_p": 0.1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        // "stop": "\n",
    }
    console.log("request texrt")
    try {
        const completion = await openaiObj.createCompletion(myQuest);
        console.log(completion.data.choices[0].text);
        msg = completion.data.choices[0].text
        msg = "# " + msg.trim()
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }

    var request = require('request');
    request.post(
        getDestinationMMUrl(),
        { json: { "text": msg } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log("got error")
            }
        }
    );
}

const SCORE_CHART_TYPE = "score_chart"
const REPORT_CHART_TYPE = "report_chart"

async function getReportChart(jsonData) {
    const result = await sendChartAsImage("Team Records", REPORT_CHART_TYPE);
    return result;
}

async function getScoreChart(jsonData) {
    const result = await sendChartAsImage("Team Scores", SCORE_CHART_TYPE);
    return result;
}

function showHelp(jsonData) {
    console.log("showHelp")
}

async function chatBot(jsonData) {
    console.log("chatBot1")
    if (jsonData.text.startsWith("Raven Chat:")) {
        var question = jsonData.text.replace('Raven Chat:', '');


        console.log("chat to vietanh")
        let myQuest2 = {
            "model": "text-davinci-003",
            "prompt": question,
            "max_tokens": 4000,
            "top_p": 0.1,
        }
        try {
            let msg = ""
            const completion = await openaiObj.createCompletion(myQuest2);
            console.log(completion.data.choices[0].text);
            msg = completion.data.choices[0].text
            msg = msg.trim()

            var request = require('request');
            request.post(
                getDestinationMMUrl(),
                { json: { "text": msg } },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    } else {
                        console.log("got error")
                    }
                }
            );
        } catch (error) {
            if (error.response) {
                console.log(error.response.status);
                console.log(error.response.data);
            } else {
                console.log(error.message);
            }
        }

    }
}


function checkMemberMissingRecord(jsonData) {
    console.log("showHelp")
    let missingRec = getMemberMissingRecord()
    let myQuestion = 'Help me(iam DMLCN Team) remind ' + missingRec + " to fill in daily tasks politely and gently"
    requestOpenAIAndSendMM(myQuestion)
}

async function requestOpenAIAndSendMM(myQuestion) {
    console.log("chat to vietanh")
    let myQuest2 = {
        "model": "text-davinci-003",
        "prompt": myQuestion,
        "max_tokens": 2000,
        // "temperature": 0,
        "top_p": 0.1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        // "stop": "\n",
    }
    try {
        let msg = ""
        const completion = await openaiObj.createCompletion(myQuest2);
        console.log(completion.data.choices[0].text);
        msg = completion.data.choices[0].text
        msg = msg.trim()
        var request = require('request');
        request.post(
            getDestinationMMUrl(),
            { json: { "text": msg } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log("got error")
                }
            }
        );
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}

async function sendBuildToQA(jsonData) {
    console.log("sendBuildToQA")

    // var dataInLines = jsonData.text.split('\n');
    var preDataBuild = "Tôi là Dev-Chan"
    // var dataBuild = ""
    // console.log("Parsing data")
    // const reName = /Giúp tôi gửi thông tin build này tới các bạn QAs.*/;
    // const reReports = /.*/
    // dataInLines.forEach(readData)
    // function readData(value, index, array) {
    //     console.log("value222")
    //     console.log(value)
    //     if (filters = value.match(reName)) {
    //         console.log("Parsing data 1")
    //         console.log(value)
    //     } else if (filters = value.match(reReports)) {
    //         console.log("Parsing data 2")
    //         console.log(value)
    //         dataBuild = dataBuild + "\n" + filters[0]
    //     }
    // }
    var question = jsonData.text.replace('Raven SendToQA:', '');
    let myQuestion = preDataBuild + "\n" + jsonData.text
    console.log(myQuestion)
    let myQuest2 = {
        "model": "text-davinci-003",
        "prompt": myQuestion,
        "max_tokens": 2000,
        // "temperature": 0,
        "top_p": 0.1,
        "n": 1,
        "stream": false,
        "logprobs": null,
        // "stop": "\n",
    }
    try {
        let msg = ""
        const completion = await openaiObj.createCompletion(myQuest2);
        console.log(completion.data.choices[0].text);
        msg = completion.data.choices[0].text
        msg = msg.trim()
        var request = require('request');
        request.post(
            "https://chat.gameloft.org/hooks/mzzto39n73g35dmn7rd5e4i3qo",
            { json: { "text": msg } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log("got error")
                }
            }
        );
    } catch (error) {
        if (error.response) {
            console.log(error.response.status);
            console.log(error.response.data);
        } else {
            console.log(error.message);
        }
    }
}


app.post('/doTask', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            console.log("doTask for the data")
            console.log(data)
            jsonData = JSON.parse(data)
            console.log(jsonData)
            console.log(jsonData["text"])
            console.log(jsonData["user_name"])
            let result = "result nonwe"
            if (jsonData["text"]) {
                if (jsonData["text"].startsWith("Reporting for")) {
                    sendReport(jsonData)
                } else if (jsonData["text"].startsWith("Raven Show Reports")) {
                    result = await getReportChart(jsonData)
                } else if (jsonData["text"].startsWith("Raven Show Score")) {
                    result = await getScoreChart(jsonData)
                } else if (jsonData["text"].startsWith("Raven Thank")) {
                    sendThank(jsonData)
                } else if (jsonData["text"].startsWith("Raven Daily Remind")) {
                    sendDailyRemind(jsonData)
                } else if (jsonData["text"].startsWith("Raven Chat")) {
                    chatBot(jsonData)
                } else if (jsonData["text"].startsWith("Raven SendToQA:")) {
                    sendBuildToQA(jsonData)
                } else if (jsonData["text"].startsWith("Raven Help")) {
                    GetHelp(jsonData)
                } else if (jsonData["text"].toLowerCase().startsWith("raven-jira: create")) {
                    CreateAndAddTasks(jsonData)
                }
            }

            res.end(result)
        })
    }
})


MSG_CREATE_DONE = "Create Done!"
MSG_CREATE_FAILED = "Create Failed"

function CreateAndAddTasks(jsonData) {
    console.log("CreateAndAddTasks")
    if (jsonData["user_name"] !== "dat.letien2" && jsonData["user_name"] !== "anh.nguyenviet6") {
        failed_msg = "You couldn't do the action. Please ask your Manager"
        request.post(
            getDestinationMMUrl(),
            { json: { "text": failed_msg } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log("got error")
                }
            }
        );
    } else {
        console.log("parse data")
        var dataInLines = jsonData.text.split('\n');

        var requestData = {}
        const reVersion = /(game_version:)(.*)/;
        const reEpicLinks = /(epic_link:)(.*)/
        dataInLines.forEach(readData)
        function readData(value, index, array) {
            console.log(value)
            if (filters = value.match(reVersion)) {
                console.log("Parsing data 1")
                console.log(filters[1])
                console.log(filters[2])
                // requestData["gameVersion"] = filters[2]
            } else if (filters = value.match(reEpicLinks)) {
                console.log("Parsing data 2")
                console.log(filters[1])
                console.log(filters[2])
                // requestData["epicLink"] = filters[2]
            }
        }
        console.log(JSON.stringify(requestData, null, 3))
        var url = "https://jira.gameloft.org/rest/cb-automation/latest/hooks/11ab6d4646e1a816c474ff572518a7b3fd2c7084"

        var request = require('request');
        request.post(
            url,
            { json: requestData },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log("CreateAndAddTasks Success");

                    request.post(
                        getDestinationMMUrl(),
                        { json: { "text": MSG_CREATE_DONE } },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                            } else {
                                console.log("got error")
                            }
                        }
                    );
                } else {
                    console.log("CreateAndAddTasks Err");
                    console.log(error);
                    console.log(response);
                    var failed_msg = MSG_CREATE_FAILED
                    request.post(
                        getDestinationMMUrl(),
                        { json: { "text": failed_msg } },
                        function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                console.log(body);
                            } else {
                                console.log("got error")
                            }
                        }
                    );
                }
            }
        );
    }
}

function GetHelp(jsonData) {
    var msg = "#### Raven Options.\n\n| Option  | Command   | Note |"
        + "\n|:-----------|:-----------:|:-----------------------------------------------|"
        + "\n| To Show Report | Raven Show Reports | ✅ |"
        + "\n| To Show Score | Raven Show Score | ✅  |"
        + "\n| To Daily Remind | Raven Daily Remind | ✅ |"
        + "\n| To Send Thank For Reports | Raven Thank |  ✅ |"
        + "\n| To Reporting | Reporting for <data> |  ✅ |"
        + "\n| To Send Msg to QA | Raven SendToQA: |  ✅ |"
        + "\n| To Chat with Raven | Raven Chat |  ✅ |"
        + "\n| To Create Jira GameVersion and Relating Tasks | Raven-Jira: Create + \ngame_version:<version>\nepic_link:<epic> |  only availble for managers |"
    // msg = msg + "\n" + "`To Show Report` -> `Raven Show Reports`"
    // msg = msg + "\n" + "`To Show Score` -> `Raven Show Score`"
    // msg = msg + "\n" + "`To Daily Remind` -> `Raven Daily Remind`"
    // msg = msg + "\n" + "`To Send Thank For Reports` -> `Raven Thank`"
    // msg = msg + "\n" + "`To Reporting` -> `Reporting for <data>`"
    // msg = msg + "\n" + "`To Send Build to QA` -> `Giúp tôi gửi thông tin build này tới các bạn QAs + <data>`"
    // msg = msg + "\n" + "`To Chat with Raven` -> `Raven Chat` "

    console.log("GetHelp")
    console.log(msg)
    var request = require('request');
    request.post(
        getDestinationMMUrl(),
        { json: { "text": msg } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log("got error")
            }
        }
    );
}


var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    // http://127.0.0.1:3000/listUsers
    console.log("Example app listening at http://%s:%s", host, port)
})