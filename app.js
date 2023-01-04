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
    var request = require('request');

    request.post(
        'https://chat.gameloft.org/hooks/3xuqbiou1iyo9rc5otwkg7zywa',
        { json: { "text": 'helllo' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
    );
})
var server = app.listen(port, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})