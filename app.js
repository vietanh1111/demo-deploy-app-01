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
      console.log( data );
      res.end( data );
   });
})

app.post('/sayHello', function (req, res) {
    console.log("1")
    console.log("req===========")
    console.log(req)
    console.log("res===========")
    console.log(res)
    var POST = {};
    if (req.method == 'POST') {
        req.on('data', function(data) {
            console.log("data===========")
            console.log(data)
            data = data.toString();
            data = data.split('&');
            for (var i = 0; i < data.length; i++) {
                var _data = data[i].split("=");
                POST[_data[0]] = _data[1];
            }
            console.log(POST);
        })
    }    

    var request = require('request');
    console.log("2")
    request.post(
        'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
        { json: { "text": 'helllo' } },
        function (error, response, body) {
            console.log("vietanh11")
            console.log("error===========")
            console.log(error)
            console.log("response===========")
            console.log(response)
            console.log("body===========")
            console.log(body)
            if (!error && response.statusCode == 200) {
                console.log(body);
            } else {
                console.log("got error")
            }
            console.log("vietanh12")
        }
    );

    res.end("sayHello End");
})
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})