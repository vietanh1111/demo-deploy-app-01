var express = require('express');
var app = express();
var fs = require("fs");

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
      jsonData = JSON.parse(data)
      console.log( jsonData.user1 );
      res.end( data );
   });
})

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
                    // if (myData[value]["stuck"].includes('1. no') || myData[value]["stuck"].includes('1. No'))
                    //     console.log(value)
                    // else
                        stuck_members.push(value)
                }
            }
            
            console.log(good_members)
            console.log(stuck_members.toString())
            console.log(bad_members)

            var request = require('request');
            request.post(
                'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
                { json: { "text": "**THANK YOU!** \n" + good_members +  " Your reports were recorded :pepe_xmasclap: :pepe_xmasclap: :pepe_xmasclap: \n-------------------------\n# :pepe-dao: :pepe-dao: :pepe-dao: \n" + bad_members + "\n \n------------------------- " + stuck_members + " You seems got issues, Could i help you?" } },
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
   console.log("Example app listening at http://%s:%s", host, port)
})