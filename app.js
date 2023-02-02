var express = require('express');
var app = express();
var fs = require("fs");

const openai = require("openai");
const Configuration = openai.Configuration;
const OpenAIApi = openai.OpenAIApi;

const configuration = new Configuration({
    organization: "org-kZkL4Z0rkGFT2U9PH5n4aBJy",
    apiKey: "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",
});
console.log(process.env.OPENAI_API_KEY)
const openaiObj = new OpenAIApi(configuration);


team_member = {
    "Anh Nguyen Viet 6": {
        "email": "anh.nguyenviet6@gameloft.com"
    },
    "Quy Nguyen Ngoc": {
        "email": "quy.nguyenngoc@gameloft.com"
    },
    "Duc Luu Trong": {
        "email": "duc.luutrong@gameloft.com"
    },
    "Trung Mai Duc 2": {
        "email": "trung.maiduc2@gameloft.com"
    },
    "Minh Nguyen Chinh": {
        "email": "minh.nguyenchinh@gameloft.com"
    },
    "Duy Nguyen Khanh": {
        "email": "duy.nguyenkhanh@gameloft.com"
    },
    "Giang Trinh Thuy": {
        "email": "giang.trinhthuy@gameloft.com"
    },
    "Anh Bui Thi Ngoc": {
        "email": "anh.buithingoc@gameloft.com"
    },
    "Dung Nguyen Phuong 2": {
        "email": "dung.nguyenphuong2@gameloft.com"
    }
}

const port = process.env.PORT || 3000
const data_path = "./member_data.json";

var user = {
    "user4": {
        "name": "mohit",
        "password": "password4",
        "profession": "teacher",
        "id": 4
    }
}

/*
Steps:
- Read data.json to initialize member objects from data.json
e.g.:
{
    "20230130" : {
        "anh.nguyenviet6": {
            "name":"Vietanh6",
            "report_contents":"",
            "report_nums":"0"
        },
        "trung.maiduc2": {
            "name":"MaiDucTrung2",
            "report_contents":"",
            "report_nums":0
        }
    },
    "20230131" : {
        "anh.nguyenviet6": {
            "name":"Vietanh6",
            "report_contents":"",
            "report_nums":"0"
        },
        "trung.maiduc2": {
            "name":"MaiDucTrung2",
            "report_contents":"",
            "report_nums":0
        }
    }    
}

- Read data from MM to update each members
- Save to data.json
*/

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

app.post('/report', function (req, res) {
    var jsonData = {};
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            data = data.toString()
            jsonData = JSON.parse(data)
            console.log("jsonData.text")
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
            const reName = /(Reporting for )(.*)([:])/;
            const reReports = /(.*)/
            membersData.forEach(readData)
            function readData(value, index, array) {
                if (filters = value.match(reName)) {
                    myname = filters[2].trim()
                    myData[currentDate][myname] = {}
                } else if (filters = value.match(reReports)) {
                    if (myname != "" && !myData[currentDate][myname]["reports"]) myData[currentDate][myname]["reports"] = [];
                    myData[currentDate][myname]["reports"].push(filters[0])
                }
            }

            console.log("\nShow myData")
            console.log('myData : %j', myData);

            const fs = require('fs');
            let readDataStr = ""
            let readDataJson = ""
            try {
                readDataStr = fs.readFileSync('./Output.txt', 'utf8');
                readDataJson = JSON.parse(readDataStr);
            } catch (err) {
            }

            const JSONObjectMerge = require("json-object-merge");
            const merged = JSONObjectMerge.default(myData, readDataJson);
            console.log(JSON.stringify(merged, null, 3));

            if (fs.existsSync(data_path)) {
                // path exists
                const myJSON = JSON.stringify(merged, null, 3);
                fs.writeFile('Output.txt', myJSON, (err) => {
                    // In case of a error throw err.
                    if (err) throw err;
                    console.log("exists:3", data_path);
                    console.log("vietanh git 3");
                    var execProcess = require("./exec_process.js");
                    execProcess.result("sh temp.sh", function(err, response){
                        console.log("aaa")
                        if(!err){
                            console.log("1")
                            console.log(response);
                        }else {
                            console.log("2")
                            console.log(err);
                        }
                    });
                })
            }

            let msg = ""

            let myQuest = {
                "model": "text-davinci-003",
                "prompt": "Could you help to thank the report of " + myname + "?",
            }            
            try {
                const completion = await openaiObj.createCompletion(myQuest);
                console.log(completion.data.choices[0].text);
                msg = completion.data.choices[0].text
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
                // 'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a',
                'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
                { json: { "text": msg } },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log(body);
                    } else {
                        console.log("got error")
                    }
                }
            );
            res.end("sayHello End");
        })
    }
})

app.post('/numOfReport', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            let dataStr = data.toString()
            let membersData = getUserDataFromFile()
            console.log(dataStr)

            for (var member of Object.keys(team_member)) {
                team_member_email = team_member[member]["email"]
                number_records = 0
                for (var memberData of Object.keys(membersData)) {
                    if (membersData[memberData][team_member_email]) {
                        console.log("find record: " + team_member_email)
                        number_records += 1
                    }
                }

            }

            //             var request = require('request');
            //             var jsonDataObj = {
            //   "model": "text-davinci-003",
            //   "prompt": "Say this is a test",
            //   "max_tokens": 7,
            //   "temperature": 0,
            //   "top_p": 1,
            //   "n": 1,
            //   "stream": false,
            //   "logprobs": null,
            //   "stop": "\n"
            // }

            //             request.post({
            //             headers: {'content-type' : 'application/json'},
            //             url:     'https://api.openai.com/v1/completions',
            //             body:    jsonDataObj
            //             }, function(error, response, body){
            //                 console.log("body");
            //                 console.log(body);
            //             });

            //             res.end("numOfReport End");         

            // response = openaiObj.createCompletion(
            // model="text-davinci-003",
            // prompt="This is a test",
            // max_tokens=5,
            // user="user123456"
            // )
            let mydataa = {
                "giang.trinhthuy@gameloft.com": {
                    "reports": [
                        "+ successfully posted sigils with abnormal amount in inventory to mattermost upon detection",
                        "+ try to reproduce the sigil amount bug"
                    ]
                }
            }
            let myQuest = {
                "model": "text-davinci-003",
                "prompt": "Could you help to thank Minh?",
            }

            try {
                const completion = await openaiObj.createCompletion(myQuest);
                console.log(completion.data.choices[0].text);
            } catch (error) {
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else {
                    console.log(error.message);
                }
            }

            res.end("numOfReport End");     
        })
    }
})


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

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    // http://127.0.0.1:3000/listUsers
    console.log("Example app listening at http://%s:%s", host, port)
})