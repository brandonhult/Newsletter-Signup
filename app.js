var bodyParser = require('body-parser');
var request = require('request');
const https = require('https');
var express = require('express');

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
  const firstName = req.body.firstNameText;
  const lastName = req.body.lastNameText;
  const email = req.body.emailText;

  var data = {
      members: [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: firstName,
              LNAME: lastName
            }
        }
      ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us1.api.mailchimp.com/3.0/lists/88f88c90d8"

    const options = {
      method: "POST",
      auth: "brandon:fc59b7f404e8b002a321dc9687266262-us1"
    }

    const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
          res.sendFile(__dirname + "/success.html");
        } else {
          res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
          console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post('/failure', function(req, res){
  res.redirect('/');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});


// Mailchimp API Key
// fc59b7f404e8b002a321dc9687266262-us1

// Mailchimp List ID
// 88f88c90d8
