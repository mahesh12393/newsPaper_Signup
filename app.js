const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// const port = 3000;

const app = express();
//the below lie specifies that we have placed all sttaic files in one folder public
app.use(express.static("public"));
//app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){//get request
  res.sendFile(__dirname+"/index.html");
});

app.post('/',function(req,res){//post request

  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const data = {
    members : [
      {
      email_address :email,
      status : "subscribed",
      merge_fields: {
        FNAME : firstName,
        LNAME : lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);//we want to send our data like a json string for the mailchimp so we are using jsonstringify method

  const url = "https://us7.api.mailchimp.com/3.0/lists/a4484c6095";
  const options = {
    method: "POST",
    auth : "Maheswar:376483fb67847787663468196fc5aeff-us7"
  }
  const request = https.request(url,options,function(response){
    if(response.statusCode == 200){
        res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function (data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();

});

app.post("/failure",function (req,res){//when someone goes to failure page
  res.redirect("/");//this line redirects to the home page
})

//by defining process.env.port we are asking heroku to take any server which it can at the time of uploading
//by writing  || we are ensuring the website works on both heroku as well as locally
app.listen(process.env.PORT || 3000,function(){
    console.log("Sever is up and running on port 3000");
});


//api key for mailchimp
//376483fb67847787663468196fc5aeff-us7





//id for audience
//a4484c6095
