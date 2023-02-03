var express = require('express');
var app = express();
var fs = require("fs");

const openai = require("openai");
const Configuration = openai.Configuration;
const OpenAIApi = openai.OpenAIApi;
let key = "sk-cdJTv8Crc6sp9IdUaZcPT3BlbkFJ4dNzhY0ne52NvyaU"
let key2 = "NjZl"
const configuration = new Configuration({
    organization: "org-kZkL4Z0rkGFT2U9PH5n4aBJy",
    apiKey: key + key2,
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
            console.log("data")
            console.log(data)
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
            const reName = /(Reporting for )(.*)/;
            const reReports = /(.*)/
            membersData.forEach(readData)
            function readData(value, index, array) {
                console.log("value222")
                console.log(value)
                if (filters = value.match(reName)) {
                    console.log("Parsing data 1")
                    console.log(filters[1])
                    console.log(filters[2])
                    myname = filters[2].trim()
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
            let readDataJson = ""
            try {
                readDataStr = fs.readFileSync(data_path, 'utf8');
                readDataJson = JSON.parse(readDataStr);
            } catch (err) {
            }

            const JSONObjectMerge = require("json-object-merge");
            const merged = JSONObjectMerge.default(myData, readDataJson);
            console.log(JSON.stringify(merged, null, 3));

            if (fs.existsSync(data_path)) {
                // path exists
                const myJSON = JSON.stringify(merged, null, 3);
                fs.writeFile(data_path, myJSON, (err) => {
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
            console.log(myData[currentDate][myname]["reports"] + "?")
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
                msg = completion.data.choices[0].text
            } catch (error) {
                if (error.response) {
                    console.log(error.response.status);
                    console.log(error.response.data);
                } else {
                    console.log(error.message);
                }
            }

            let myQuest2 = {
                "model": "text-davinci-003",
                "prompt": "Say thank the report of " + myname + "?" + "say wish me a good working day",
                "max_tokens": 1000,
                // "temperature": 0,
                "top_p": 0.9,
                "n": 1,
                "stream": false,
                "logprobs": null,
            }
            try {
                const completion = await openaiObj.createCompletion(myQuest2);
                console.log(completion.data.choices[0].text);
                msg += completion.data.choices[0].text
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
                'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a',
                // 'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
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

app.post('/sendMsg', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            let msg = ""

            let myQuest = {
                "model": "text-davinci-003",
                "prompt": "hello bot",
            }
            try {
                const completion = await openaiObj.createCompletion(myQuest);
                let myQuest2 = {
                    "model": "text-davinci-003",
                    "prompt": "Help me give my teammates reminder that \"you need to fill out the daily task today\"",
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
                'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a',
                // 'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
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

app.post('/getNumOfReports', function (req, res) {
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

            res.end("numOfReport End");
        })
    }
})


app.post('/chatToVietanh', function (req, res) {
    if (req.method == 'POST') {
        req.on('data', async function (data) {
            let dataStr = data.toString()
            console.log("data.toString()")
            console.log(data.toString())
            jsonData = JSON.parse(dataStr)
            console.log("jsonData.text")
            console.log(jsonData.text)
            console.log(jsonData.user_name)

            if (jsonData.user_name == "anh.nguyenviet6") {
                console.log("chat to vietanh")
                let myQuest2 = {
                    "model": "text-davinci-003",
                    "prompt": jsonData.text,
                    "max_tokens": 2000,
                    // "temperature": 0,
                    "top_p": 0.5,
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
                    msg = "# " + msg.trim()
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
                } catch (error) {
                    if (error.response) {
                        console.log(error.response.status);
                        console.log(error.response.data);
                    } else {
                        console.log(error.message);
                    }
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