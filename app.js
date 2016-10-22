var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));

// serve static files
app.use(express.static('client'));


// have all links direct to our main file
app.all('/*', function ( req, res ) {
        res.sendFile(__dirname + '/client/index.html');
    })

// make the server start and listen
server.listen(process.env.PORT || 3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("So many Octofeeeeeeeels on port " + port);
});