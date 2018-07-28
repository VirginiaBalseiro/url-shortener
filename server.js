'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');

var app = express();

var shortUrl = require('./models/shortUrl');
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
mongoose.connect(process.env.MONGOLAB_URI, { useNewUrlParser: true });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));


/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.post('/api/shorturl/new', function (req, res, next) {
  var urlToShorten = req.body.url;
  var regex = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  if (regex.test(urlToShorten) === true){
    var shortened = Math.floor(Math.random()*10000).toString();
    
    var data = new shortUrl({
      originalUrl: urlToShorten,
      shorterUrl: shortened
      }
    );
    
    data.save(err=>{
      if(err){
        return res.send("Error saving to database");
      }
    });
    
      return res.json({data});
  }
  var data = new shortUrl({
      originalUrl: urlToShorten,
      shorterUrl: "Invalid URL"
      }
    );
  return res.json({data});
  
});

//forward to original url
app.get('/api/shorturl/:urlToForward', function (req, res, next) {
  var shorterUrl = req.params.urlToForward;
  
  shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data) => {
    if(err){
      res.send("error reading database");
    }
  var urlregex = new RegExp("^(http|https)://", "i");
  var stringToCheck = data.originalUrl;
  
  if (urlregex.test(stringToCheck) === true){
    res.redirect(301, data.originalUrl);
  }
    else {
    res.redirect(301, "http://" + data.originalUrl);
    }
});
});


app.listen(port, function () {
  console.log('Node.js listening on port:' + port);
});