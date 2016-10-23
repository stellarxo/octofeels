var express = require('express');
var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);

// if the port is not local, then we need https for chrome
if(port !== 3000) {
	var https = require('https');
	
	// TODO load certs
	// var options = {
	//   key: fs.readFileSync('cert/octofeels.tk.key'),
	//   cert: fs.readFileSync('cert/octofeels.crt')
	// };

	// TODO actually change server to be https
	// server = https.createServer(options, app);
}

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
}));

// serve static files
app.use(express.static('client'));

// get all files for the current emotion
app.get('/api/images/:emotion', function(req, res) {
	var path = 'client/img/' + req.params.emotion

	fs.readdir(path, function(err, items) {
	    res.send(items)
	});
})

// have all links direct to our main file
app.all('/*', function ( req, res ) {
        res.sendFile(__dirname + '/client/index.html');
    })

// make the server start and listen
server.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("So many Octofeeeeeeeels on port " + port);
});