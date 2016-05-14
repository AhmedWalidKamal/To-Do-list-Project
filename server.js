var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var authenticatedUser = null;
app.use(express.static('Front End'));
app.use(bodyParser.json());

// Email validation funciton
function validateEmail(email) 
{
    // using regular expression.
    if (email.length > 0)
    {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  }
  else
    return false;
} 

// Password validation function
function validatePassword(pass) 
{
  if (pass.length < 5)
    return false;
  else
    return true;
}

// Username validation function
function validateUsername(name) 
{
  if (name.length > 0)
    return /^[a-zA-Z]*$/.test(name);
  else
    return false;
}
// Number of users already registered
var usersCount = 0;
var id = 0;
var storedData;
var userNAME;
var storedData2;

/**** This part to handle default request url= localhost:8081 ******/
app.get('/', function (req, res) {
  res.sendFile( __dirname + "/" + "homepage.html" );
})

app.get('/homepage.html', function (req, res) {
  res.sendFile( __dirname + "/" + "homepage.html" );
})

app.post('/login', urlencodedParser, function (req, res) {

  // Get the values of the input text email & password
  email = req.body.email;
  password = req.body.password;
  console.log(email);
  console.log(password);
  
  // Read JSON file containing the users to verify that the user is already registered and have access
  var data = fs.readFileSync( __dirname + "/" + "users.json", 'utf8');
    // Note that err here is for handling any error occuring in opening the file
     
    var data2 = JSON.parse(data);
    var flag = 0;
    usersCount = 0;
        id = 0;
        
    for (var user in data2) 
    {
      if(email == data2[user].email) 
      {
        flag = 1;
        authenticatedUser = user; 
        break;
      }
      else 
      {
        flag = 0;
        usersCount++;
          id++;
          console.log("id: " + id);
      }
    }
    if(flag == 1) 
    {
      if (password == data2[authenticatedUser].password) 
      {
        console.log(password);
        console.log(data2[authenticatedUser].username);
        userNAME = data2[authenticatedUser].username;
        console.log("This is the tasks page");
        res.sendFile( __dirname + "/" + "ProjectPh1V1.html"); 
        console.log("herewe areee");
        try {
        storedData = fs.readFileSync(__dirname + "/" + id + ".json",  'utf8');               
        storedData2 = JSON.parse(storedData);
        storedData2["name"] = userNAME;
        console.log(userNAME);
      }catch (ex)
      {
        console.log(ex);
         storedData2["name"] = userNAME;
        console.log(userNAME);
      }
        console.log(storedData2);
      }
      else 
      {
        res.sendFile( __dirname + "/" + "wrongpass.html");
      }
    }
    // Handle invalid login by redirecting the user to the login page once again
    else {
      console.log("User Not found");
      res.sendFile( __dirname + "/" + "loginerror.html");
    }
  })

 app.get("/arraydata", function (req, res) {

    res.send(storedData2);
});

app.post('/array', function(req, res) {
    console.log("harby's herbyes");
    var data = req.body;
    console.log(data);
    
    fs.writeFile(__dirname + "/" + id + ".json", JSON.stringify(data), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(data));
        console.log(id);
    });   
    res.send('success');
    console.log('successsent');
});

 app.post('/register',urlencodedParser, function(req, res) 
 {
  console.log("got here from ajax");
  var data = req.body;
  console.log(data);
  username = data.name;
  email = data.email;
  password = data.password;

  console.log(username);
  console.log(email);
  console.log(password);

  var f = 0
  if (validateUsername(username) && validateEmail(email) && validatePassword(password))
    f = 3;
  else if (!validateUsername(username))
    f = -1;
  else if (!validatePassword(password))
    f = -2;
  
  if (f == 3)
  {
    console.log("Correct front end validations");
    newUser = { 
      "password" : password,
      "username" : username,
          "email" : email,
          "id" : id
      }
    var flag = 0;
    // Make sure this is a unique email address
    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      if (err)
        return console.error(err);
        data = JSON.parse(data);
        usersCount = 0;
        id = 0;
        flag = 0;
        console.log('Going to check if there are duplicates');
        for (var user in data)
        {
          if(email == data[user].email)
          {
            flag=1;
            break;
          }
          usersCount++;
          id++;
        }
    
      if (flag == 0) 
      {
        console.log("ok no duplicates");
        // Add user to the JSON file database and show the homepage again 
        fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
          newUser = { 
            "password" : password,
            "username" : username,
                "email" : email,
                "id" : id
            }
          console.log("read users file!");
          if (err)
            return console.error(err);
             data = JSON.parse(data); // Converting it to string.
             data[usersCount] = newUser;
             console.log(data);
            fs.writeFile(__dirname + "/" + "users.json",JSON.stringify(data), function (err) {
                   if (err)
                       return console.log(err);
                   console.log(JSON.stringify(data));
           })
             res.sendFile( __dirname + "/" + "validregister.html");
             fs.writeFile(__dirname + "/" + id + ".json",JSON.stringify({"allTasksArray[]":[],"inProgressArray[]":[],"completedArray[]":[],"archivedArray[]":[]}));
             app.get('/homepage.html', function (req, res) {
              res.sendFile( __dirname + "/" + "homepage.html" );
          })    
        }); 
      }
      else
      {
        console.log("Yes, duplicates");
        res.sendFile( __dirname + "/" + "registererror.html");
      }
    })
  }
  else if (f == -2)
  { 
    res.sendFile( __dirname + "/" + "passlength.html" );
  }
  else if (f == -1)
  {
    res.sendFile( __dirname + "/" + "usernamewrong.html");
  }
 })

app.get('/ProjectPh1V1.html', function(req, res){
  res.sendFile( __dirname + "/" + "ProjectPh1V1.html" );
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port) 
})