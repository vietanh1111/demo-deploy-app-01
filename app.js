const express = require('express');
var app = express();
const fs = require("fs");
const request = require('request')
const openai = require("openai");
const queryString = require('querystring');

const utilities = require("./utilities/utilities.js")
const printLog = utilities.printLog

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

let key = "sk-2b6uSrunRaQwfp1e5cFjT3BlbkFJKefhFZy5274MopF"
let key2 = "Q3Ns4"
const configuration = new Configuration({
    organization: "org-kZkL4Z0rkGFT2U9PH5n4aBJy",
    apiKey: key + key2,
});
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
            if (all_data[date][team_member[member]["name"]]) {
                number_records += 1
            }
        }
        all_records[team_member[member]["alias"]] = number_records

    }

    var sortedData = Object.entries(all_records).sort((a, b) => b[1] - a[1]);
    const result = sortedData.reduce((acc, item) => {
        acc[item[0]] = item[1];
        return acc;
    }, {});

    printLog(arguments.callee.name, JSON.stringify(result, null, 3))
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

    printLog(arguments.callee.name, JSON.stringify(all_records, null, 3))

    final_score = {}
    for (var member of Object.keys(all_records)) {
        final_score[member] = 0.7 * (all_records[member]["score"]) + 0.3 * (10 * all_records[member]["num_records"] / highest_record)
    }

    var sortedData = Object.entries(final_score).sort((a, b) => b[1] - a[1]);

    const result = sortedData.reduce((acc, item) => {
        acc[item[0]] = item[1];
        return acc;
    }, {});


    printLog(arguments.callee.name, "result===");
    printLog(arguments.callee.name, result);

    return result
    // return number_records
}


async function sendChartAsImage(chartName, chartType) {
    printLog(arguments.callee.name, "sendChartAsImage")

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
                    printLog(arguments.callee.name, 'The URL for the image is: ', url);
                    sendMessageToMM("# This is your chart\n" + url)
                    url_img = url
                    resolve(url);
                }
            });
        });

        const results = await Promise.all([
            s3.upload(uploadParams).promise(),
            signedUrlPromise
        ]);

        printLog(arguments.callee.name, results);
        printLog(arguments.callee.name, url_img);
        return url_img
    };

    return await waitForAllFunctions();
}

function getRecords() {
    let missRec = []
    let doneRec = []
    let membersData = getUserDataFromFile()
    for (var member of Object.keys(team_member)) {
        team_member_email = team_member[member]["name"]
        number_records = 0
        if (!membersData[getCurrentDate()][team_member_email]) {
            missRec.push(team_member[member]["name"])
        } else {
            doneRec.push(team_member[member]["name"])
        }
    }
    let rec_today = {}
    rec_today["miss"] = missRec
    rec_today["done"] = doneRec
    printLog(arguments.callee.name, JSON.stringify(rec_today, null, 3))
    return rec_today
}

async function sendReport(jsonData) {
    printLog(arguments.callee.name, "sendReport")
    if (jsonData.text.startsWith("Reporting")) {
        var membersData = jsonData.text.split('\n');
        var myname = ""
        var myData = {}
        let currentDate = getCurrentDate()
        myData[currentDate] = {}

        const reName = /(Reporting for)(.*)/gi;
        const reReports = /(.*)/
        membersData.forEach(readData)
        function readData(value, index, array) {
            if (filters = value.match(reName)) {
                myname = jsonData.user_name
                myData[currentDate][myname] = {}
            } else if (filters = value.match(reReports)) {
                if (myname != "" && !myData[currentDate][myname]["reports"]) myData[currentDate][myname]["reports"] = [];
                myData[currentDate][myname]["reports"].push(filters[0])
            }
        }

        printLog(arguments.callee.name, JSON.stringify(myData, null, 3))

        const fs = require('fs');
        let readDataStr = ""
        let readDataJson = {}
        try {
            readDataStr = fs.readFileSync(data_path, 'utf8');
            readDataJson = JSON.parse(readDataStr);
        } catch (err) {
            printLog(arguments.callee.name, "have error")
        }

        const JSONObjectMerge = require("json-object-merge");
        const merged = JSONObjectMerge.default(readDataJson, myData);

        if (fs.existsSync(data_path)) {
            printLog(arguments.callee.name, "existsSync")
            let myJSON = JSON.stringify(merged, null, 3);
            fs.writeFileSync(data_path, myJSON)
            printLog(arguments.callee.name, "1")
            printLog(arguments.callee.name, "2")
            var execProcess = require("./exec_process.js");
            execProcess.result("sh temp.sh", function (err, response) {
                if (!err) {
                    printLog(arguments.callee.name, "push OK")
                    printLog(arguments.callee.name, response);
                } else {
                    printLog(arguments.callee.name, "push failed")
                    printLog(arguments.callee.name, err);
                    return "sendReport failed"
                }
            });
        } else {
            printLog(arguments.callee.name, "Report: not found data_path=" + data_path)
        }
        return "sendReport done"
    } else {
        return "sendReport failed"
    }
}
async function sendDailyRemind() {
    printLog(arguments.callee.name, "sendDailyRemind")
    let msg = "On behalf of \"Dragon Mania Legends China Team\". Help me say hi and a polite reminder email to my friends that \"you need to fill out the daily task today\""
    requestGetOpenAIMsg(msg)
}

async function sendThank() {
    printLog(arguments.callee.name, "sendThank")
    let rec = getRecords();
    let msg = "On behalf of \"Dragon Mania Legends China Team\". Send a short email to thank my team for reporting" + " then warning " + rec["miss"] + " because missing daily report."
    requestGetOpenAIMsg(msg)
}

const SCORE_CHART_TYPE = "score_chart"
const REPORT_CHART_TYPE = "report_chart"

async function getReportChart() {
    const result = await sendChartAsImage("Team Records", REPORT_CHART_TYPE);
    return result;
}

async function getScoreChart() {
    const result = await sendChartAsImage("Team Scores", SCORE_CHART_TYPE);
    return result;
}

async function chatBot(jsonData) {
    printLog(arguments.callee.name, "chatBot")
    return requestGetOpenAIMsgForChatBotRaven(jsonData)
}

async function sendBuildToQA(jsonData) {
    printLog(arguments.callee.name, "sendBuildToQA")
    var preDataBuild = "Tôi là Dev-Chan. "
    var myQuestion = preDataBuild + jsonData;
    printLog(arguments.callee.name, myQuestion)
    return requestGetOpenAIMsg(myQuestion, "https://chat.gameloft.org/hooks/mzzto39n73g35dmn7rd5e4i3qo")
}



OPENAI_COMPLETIONS_MAX_TOKEN = 4000
OPENAI_COMPLETIONS_ALLOW_WORDS = 2500 // ~75% MAX TOKEN
let conversationRaven = "The following is a conversation with an AI assistant. The assistant have 200-IQ, is helpful, creative, clever, and very friendly."
let conversationQa = "The following is a conversation with an AI assistant. The assistant have 200-IQ, is helpful, creative, clever, and very friendly."
async function requestGetOpenAIMsgForChatBotRaven(input_question, user_name, addQuestion) {
    printLog(arguments.callee.name, "requestGetOpenAIMsgForChatBotRaven ")

    let question = "\nHuman:" + input_question + "\nAI:"
    conversationRaven = conversationRaven + question

    printLog(arguments.callee.name, "begin conversation=" + conversationRaven)
    printLog(arguments.callee.name, "words in conversation=" + conversationRaven.split(" ").length)
    if (conversationRaven.split(" ").length < OPENAI_COMPLETIONS_ALLOW_WORDS) {
        let request_data = {
            model: "text-davinci-003",
            prompt: conversationRaven,
            temperature: 0.2,
            max_tokens: OPENAI_COMPLETIONS_MAX_TOKEN,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        }

        let userQuestion = ""
        if (addQuestion) {
            let name = user_name
            userQuestion = "**" + name + ": **" + input_question 
        }

        try {
            let completion = await openaiObj.createCompletion(request_data);
            let res = completion.data.choices[0].text
            res = res.trim()
            conversationRaven = conversationRaven + res

            printLog(arguments.callee.name, "end conversationRaven=" + conversationRaven)

            // let messageMM = "**Tớ: **" + input_question + "\n**IQ-200: **" + res
            let messageMM = userQuestion + "\**IQ-200: **" + res
            res = await sendMessageToMM(messageMM)
            printLog(arguments.callee.name, "requestGetOpenAIMsgForChatBotRaven get done")
            return res

        } catch (error) {
            printLog(arguments.callee.name, "requestGetOpenAIMsgForChatBotRaven get error")
            printLog(arguments.callee.name, error)
            // let messageMM = "**Tớ: **" + input_question + "\n**IQ-200: **" + "Sorry, request Failed"
            let messageMM = "**IQ-200: **" + "Sorry, request Failed"
            res = await sendMessageToMM(messageMM)
            return res
        }
    } else {
        conversationRaven = "The following is a conversation with an AI assistant. The assistant have 200-IQ, is helpful, creative, clever, and very friendly."
        let messageMM = "**IQ-200: **" + "Rất tiếc, tôi không thể nhớ được tất cả những gì bạn nói, tôi đang xóa ký ức và chúng ta sẽ bắt đầu lại nha :hugging_face: :hugging_face: :hugging_face: "
        await sendMessageToMM(messageMM)
        return "ok and clear conversation"
    }

}

async function requestGetOpenAIMsgForChatBotQA(input_question, user_name, addQuestion) {
    printLog(arguments.callee.name, "requestGetOpenAIMsgForChatBotQA ")

    let question = "\nHuman:" + input_question + "\nAI:"
    conversationQa = conversationQa + question

    printLog(arguments.callee.name, "begin conversation=" + conversationQa)
    printLog(arguments.callee.name, "words in conversation=" + conversationQa.split(" ").length)
    if (conversationQa.split(" ").length < OPENAI_COMPLETIONS_ALLOW_WORDS) {
        let request_data = {
            model: "text-davinci-003",
            prompt: conversationQa,
            temperature: 0.2,
            max_tokens: OPENAI_COMPLETIONS_MAX_TOKEN,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        }

        let userQuestion = ""
        if (addQuestion) {
            let name = user_name
            userQuestion = "**" + name + ": **" + input_question 
        }

        try {
            let completion = await openaiObj.createCompletion(request_data);
            let res = completion.data.choices[0].text
            res = res.trim()
            conversationQa = conversationQa + res

            printLog(arguments.callee.name, "end conversationQa=" + conversationQa)

            // let messageMM = "**Tớ: **" + input_question + "\n**IQ-200: **" + res
            let messageMM = userQuestion + "\**IQ-200: **" + res
            res = await sendMessageToMM(messageMM)
            printLog(arguments.callee.name, "requestGetOpenAIMsgForChatBotQA get done")
            return res

        } catch (error) {
            printLog(arguments.callee.name, "requestGetOpenAIMsgForChatBotQA get error")
            printLog(arguments.callee.name, error)
            // let messageMM = "**Tớ: **" + input_question + "\n**IQ-200: **" + "Sorry, request Failed"
            let messageMM = "**IQ-200: **" + "Sorry, request Failed"
            res = await sendMessageToMM(messageMM)
            return res
        }
    } else {
        conversationQa = "The following is a conversation with an AI assistant. The assistant have 200-IQ, is helpful, creative, clever, and very friendly."
        let messageMM = "**IQ-200: **" + "Rất tiếc, tôi không thể nhớ được tất cả những gì bạn nói, tôi đang xóa ký ức và chúng ta sẽ bắt đầu lại nha :hugging_face: :hugging_face: :hugging_face: "
        await sendMessageToMM(messageMM)
        return "ok and clear conversation"
    }

}

async function sendMessageToMM(msg, url) {
    printLog(arguments.callee.name, "sendMessageToMM")
    let req_method = "POST"
    let req_url = getDestinationMMUrl()
    if (url) {
        req_url = url
    }
    let req_data = JSON.stringify({
        text: msg,
        user_name: "anh.nguyenviet6"
    })
    let result = await getRequestResponse(req_method, req_url, req_data)
    return result
}

async function makeRequest(req_method, req_url, req_data) {
    printLog(arguments.callee.name, "makeRequest START")
    const options = {
        url: req_url,
        method: req_method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: req_data
    };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

async function getRequestResponse(req_method, req_url, req_data) {
    console.log("getRequestResponse START")
    try {
        const response = await makeRequest(req_method, req_url, req_data);
        printLog(arguments.callee.name, "parseResponse");
        printLog(arguments.callee.name, response);
        // Do something with the response
        return response
    } catch (error) {
        printLog(arguments.callee.name, "parseResponse error");
        printLog(arguments.callee.name, error);
        return "getRequestResponse error"
    }
}

MSG_CREATE_DONE = "Create Done!!"
MSG_CREATE_FAILED = "Create Failed~~"
function CreateAndAddTasks(jsonData) {
    printLog(arguments.callee.name, "CreateAndAddTasks")
    if (jsonData["user_name"] !== "dat.letien2" && jsonData["user_name"] !== "anh.nguyenviet6") {
        failed_msg = "You couldn't do the action. Please ask your Manager"
        sendMessageToMM(failed_msg)
    } else {
        printLog(arguments.callee.name, "parse data")
        var dataInLines = jsonData.text.split('\n');

        var requestData = {}
        const reVersion = /(game_version:)(.*)/;
        const reEpicLinks = /(epic_link:)(.*)/
        dataInLines.forEach(readData)
        function readData(value, index, array) {
            printLog(arguments.callee.name, value)
            if (filters = value.match(reVersion)) {
                requestData["gameVersion"] = filters[2]
            } else if (filters = value.match(reEpicLinks)) {
                requestData["epicLink"] = filters[2]
            }
        }
        printLog(arguments.callee.name, JSON.stringify(requestData, null, 3))
        var url = "https://jira.gameloft.org/rest/cb-automation/latest/hooks/11ab6d4646e1a816c474ff572518a7b3fd2c7084"

        request.post(
            url,
            { json: requestData },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    printLog(arguments.callee.name, "CreateAndAddTasks Success");

                    sendMessageToMM(MSG_CREATE_DONE)
                } else {
                    printLog(arguments.callee.name, "CreateAndAddTasks Err");
                    printLog(arguments.callee.name, error);
                    printLog(arguments.callee.name, response);
                    sendMessageToMM(MSG_CREATE_FAILED)
                }
            }
        );
    }
}

async function GetHelp(jsonData) {
    var msg = "#### Raven Options.\n\n| Option  | Command   | Note |"
        + "\n|:-----------|:-----------:|:-----------------------------------------------|"
        + "\n| To Show Report | Raven Show Reports | ✅ |"
        + "\n| To Show Score | Raven Show Score | ✅  |"
        + "\n| To Daily Remind | Raven Daily Remind | ✅ |"
        + "\n| To Send Thank For Reports | Raven Thank |  ✅ |"
        + "\n| To Reporting | Reporting for <data> |  ✅ |"
        + "\n| To Send Msg to QA | Raven SendToQA: |  ✅ |"
        + "\n| To Chat with Raven | Raven Chat |  ✅ |"
        + "\n| To Create Jira GameVersion and Relating Tasks | Raven-Jira: Create <data> |  only availble for managers |"
    // msg = msg + "\n" + "`To Show Report` -> `Raven Show Reports`"
    // msg = msg + "\n" + "`To Show Score` -> `Raven Show Score`"
    // msg = msg + "\n" + "`To Daily Remind` -> `Raven Daily Remind`"
    // msg = msg + "\n" + "`To Send Thank For Reports` -> `Raven Thank`"
    // msg = msg + "\n" + "`To Reporting` -> `Reporting for <data>`"
    // msg = msg + "\n" + "`To Send Build to QA` -> `Giúp tôi gửi thông tin build này tới các bạn QAs + <data>`"
    // msg = msg + "\n" + "`To Chat with Raven` -> `Raven Chat` "

    printLog(arguments.callee.name, msg)
    return sendMessageToMM(msg)
}


async function requestGetOpenAIMsg(question, mmUrl) {
    printLog(arguments.callee.name, "hello ")
    let request_data = {
        "model": "text-davinci-003",
        "prompt": question,
        "max_tokens": OPENAI_COMPLETIONS_MAX_TOKEN,
        "top_p": 0.6,
        "n": 1,
        "stream": false,
        "user": "vietanh6"
    }

    try {
        let msg = ""
        const completion = await openaiObj.createCompletion(request_data);
        msg = completion.data.choices[0].text
        printLog(arguments.callee.name, "msg=" + msg)
        msg = msg.trim()
        return await sendMessageToMM(msg, mmUrl)
    } catch (error) {
        printLog(arguments.callee.name, "get error")
        printLog(arguments.callee.name, error)
        return arguments.callee.name + " get error"
    }
}


app.post('/doTask', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            printLog(arguments.callee.name, "doTask for the data")
            printLog(arguments.callee.name, data)
            jsonData = JSON.parse(data)
            let result = "result nonwe"
            if (jsonData["text"]) {
                if (jsonData["text"].toLowerCase().startsWith("reporting for")) {
                    result = await sendReport(jsonData)
                } else if (jsonData["text"].toLowerCase().startsWith("raven show reports")) {
                    result = await getReportChart()
                } else if (jsonData["text"].toLowerCase().startsWith("raven show score")) {
                    result = await getScoreChart()
                } else if (jsonData["text"].toLowerCase().startsWith("raven thank")) {
                    result = await sendThank()
                } else if (jsonData["text"].toLowerCase().startsWith("raven daily remind")) {
                    result = await sendDailyRemind()
                } else if (jsonData["text"].toLowerCase().startsWith("raven chat:")) {
                    let regex = /raven chat:/gi;
                    result = await chatBot(jsonData["text"].replace(regex, ""))
                } else if (jsonData["text"].toLowerCase().startsWith("raven sendtoqa:")) {
                    let regex = /raven sendtoqa:/gi;
                    result = await sendBuildToQA(jsonData["text"].replace(regex, ""))
                } else if (jsonData["text"].toLowerCase().startsWith("raven help")) {
                    let regex = /raven help/gi;
                    result = await GetHelp(jsonData["text"].replace(regex, ""))
                } else if (jsonData["text"].toLowerCase().startsWith("raven-jira: create")) {
                    let regex = /raven-jira: create/gi;
                    result = await CreateAndAddTasks(jsonData["text"].replace(regex, ""))
                }
            }

            res.end(result)
        })
    }
})

app.post('/doChatOpenAI_slash', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            console.log("doChatOpenAI for the data")
            console.log(data)

            let params = queryString.parse(data);
            let question = params.text;
            let userName = params.user_name;
            let response = await requestGetOpenAIMsgForChatBotQA(question, userName, true)
            console.log("DONE")
            res.end(response)
        })
    }
})


var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    // http://127.0.0.1:3000/listUsers
    console.log("Example app listening at http://%s:%s", host, port)
})