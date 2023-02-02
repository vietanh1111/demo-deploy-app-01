var express = require('express');
var app = express();
var fs = require("fs");

team_member = {
    "Anh Nguyen Viet 6" : {
        "email": "anh.nguyenviet6@gameloft.com"
    },
    "Quy Nguyen Ngoc" : {
        "email": "quy.nguyenngoc@gameloft.com"
    },  
    "Duc Luu Trong" : {
        "email": "duc.luutrong@gameloft.com"
    },
    "Trung Mai Duc 2" : {
        "email": "trung.maiduc2@gameloft.com"
    },
    "Minh Nguyen Chinh" : {
        "email": "minh.nguyenchinh@gameloft.com"
    },  
    "Duy Nguyen Khanh" : {
        "email": "duy.nguyenkhanh@gameloft.com"
    }, 
    "Giang Trinh Thuy" : {
        "email": "giang.trinhthuy@gameloft.com"
    }, 
    "Anh Bui Thi Ngoc" : {
        "email": "anh.buithingoc@gameloft.com"
    }, 
    "Dung Nguyen Phuong 2" : {
        "email": "dung.nguyenphuong2@gameloft.com"
    }                                                                                                                      
}

const port = process.env.PORT || 3000

var user = {
   "user4" : {
      "name" : "mohit",
      "password" : "password4",
      "profession" : "teacher",
      "id": 4
   }
}

// class Member {
//     /*
//         name: name of the member
//         report_contents: contents of the report
//         report_nums: how many times was the member reported
//     */
//     constructor(name, report_contents, report_nums ) {
//         this.name = name
//         this.report_contents = report_contents
//         this.report_nums = report_nums
//     }
// }


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

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {

    const fs = require('fs')
      
    const path = "./Output.txt";

    if (fs.existsSync(path)) {
        // path exists
        console.log("exists:", path);
        fs.appendFile('Output.txt', '\ndata to append', function (err) {
        if (err) throw err;
        console.log('Saved!');
        });        
    } else {
        console.log("DOES NOT exist:", path);
        // Write data in 'Output.txt' .
        fs.writeFile('Output.txt', "aaaaa", (err) => {
            
            // In case of a error throw err.
            if (err) throw err;
        })
    }

    console.log( "vietanh git 1" );
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

    jsonData = JSON.parse(data)
    console.log( jsonData.user1 );
    res.end( data );
   });
})

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

app.post('/sayHello', function (req, res) {
    var jsonData = {};
    if (req.method == 'POST') {
        req.on('data', function(data) {
            data = data.toString()
            jsonData = JSON.parse(data)
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
                if (filters = value.match(reName)) {
                    myname = filters[2].trim()
                    myData[currentDate][myname] = {}
                } else if (filters = value.match(reReports)) {
                    if(myname != "" && !myData[currentDate][myname]["reports"]) myData[currentDate][myname]["reports"] = [];
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

            // merge myDataJson to readDataJson

    
            const path = "./Output.txt";

            if (fs.existsSync(path)) {
                // path exists
                console.log("exists:1", path);
                const myJSON = JSON.stringify(merged, null, 3);

                fs.writeFile('Output.txt', myJSON, (err) => {
                    // In case of a error throw err.
                    if (err) throw err;
                    console.log("exists:3", path);
                    console.log( "vietanh git 3" );
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
            } else {
                console.log("DOES NOT exist:", path);
                // Write data in 'Output.txt' .
                fs.writeFile('Output.txt', " ", (err) => {
                    
                    // In case of a error throw err.
                    if (err) throw err;
                    console.log("exists:3", path);
                    console.log( "vietanh git 3" );
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

            // var request = require('request');
            // request.post(
            //     // 'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a',
            //     'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
            //     { json: { "text": msg } },
            //     function (error, response, body) {
            //         if (!error && response.statusCode == 200) {
            //             console.log(body);
            //         } else {
            //             console.log("got error")
            //         }
            //     }
            // );
            res.end("sayHello End");            
        })
    }    
})
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   // http://127.0.0.1:3000/listUsers
   console.log("Example app listening at http://%s:%s", host, port)
})