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

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
    //   console.log( data );



    const fs = require('fs')
      
    // // Data which will write in a file.
    // let data2 = "Learning how to write in a file."
      
    // // Write data in 'Output.txt' .
    // fs.writeFile('Output.txt', data2, (err) => {
          
    //     // In case of a error throw err.
    //     if (err) throw err;
    // })

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

    console.log( "vietanh git" );
    var execProcess = require("./exec_process.js");
    execProcess.result("sh temp.sh", function(err, response){
        if(!err){
            console.log(response);
        }else {
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
            console.log(jsonData.trigger_word)
            console.log("jsonData")
            console.log(jsonData)
            var membersData = jsonData.text.split('\n');
            var idx = 0
            var myname = ""
            var step = 0
            var myData = {}

            const reName = /([#]{4}\s[!].*[)])(.*)/;
            const reDoAndLearn = /##### What did you do/;  
            const reTasks = /1.\s.*/;
            const reStucksStart = /Is there any problems/;  
            const reStucks = /1.\s.*/;
            membersData.forEach(readData)
            function readData(value, index, array) {
                if (filters = value.match(reName)) {
                    step = 0
                    idx = idx + 1
                    myname = filters[2].trim()
                    myData[myname] = {}

                } else if (filters = value.match(reDoAndLearn)) {
                    step = 1
                    myData[myname]["doAndLearn"] = [];
                } else if ((filters = value.match(reTasks))&& step == 1) {
                    myData[myname]["doAndLearn"].push(filters[0])
                } else if (filters = value.match(reStucksStart)) {
                    step = 2
                    myData[myname]["stuck"] = [];
                } else if ((filters = value.match(reStucks)) && step == 2 ) {
                    myData[myname]["stuck"].push(filters[0])
                }
            }

            good_members = []
            bad_members = []

            const keys = Object.keys(team_member);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (key in myData) {
                    good_members.push(key)
                } else {
                    bad_members.push(key)
                }
            }

            stuck_members = []
            good_members.forEach(checkStuck)
            function checkStuck(value, index, array) {
                if (myData[value]["stuck"] != null) {
                    if (myData[value]["stuck"].includes('1. no') || myData[value]["stuck"].includes('1. No'))
                        console.log(value)
                    else
                        stuck_members.push(value)
                }
            }
            
            // console.log(good_members)
            // console.log(stuck_members.toString())
            // console.log(bad_members)

            var request = require('request');
            request.post(
                'https://chat.gameloft.org/hooks/zgzs61kbmtbiuradjy6ut6oi8a',
                { json: { "text": "**THANK YOU!** \n" + convertToEmail(good_members) +  "\n=> Your reports were recorded\n :pepe_xmasclap: :pepe_xmasclap: :pepe_xmasclap: \n\n--------------------------------\n\n:pepe-dao: :pepe-dao: :pepe-dao: \n" + convertToEmail(bad_members) + "\n\n--------------------------------\n" + convertToEmail(stuck_members) + " You seems got issues, Could i help you?" } },
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
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   // http://127.0.0.1:3000/listUsers
   console.log("Example app listening at http://%s:%s", host, port)
})