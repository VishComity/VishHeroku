var connection = require('./lib/connection');
var express = require('express');
var port = process.env.PORT || 3000;
var nforce = require('nforce');

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(connection.org.getAuthUri());
});

app.get('/oauthcallback', function(req, res) {
	connection.org.authenticate({code: req.query.code}, function(err, resp){
		if(!err) {
			console.log('Access Token: ' + resp.access_token);
			app.locals.oauthtoken = resp.access_token;
			app.locals.lightningEndPointURI = "https://vishlightningss-dev-ed.lightning.force.com/";
			res.redirect('/home');
		} else {
			console.log('Error: ' + err.message);
		}
	});
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);