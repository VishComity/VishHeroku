var nforce = require('nforce');
var express = require('express');
var port = process.env.PORT || 3000;

var org = nforce.createConnection({
	clientId: '3MVG9xOCXq4ID1uENR_n0vamNcV9ttUyOINbn6coRAQ4rj4QrMvdOoUozVXyqlXIZXQ0Yp1kgmpGRGXX0j1cB',
	clientSecret: '5893789878304722858',
	redirectUri: 'https://oauthss.herokuapp.com/oauthcallback',
	apiVersion: 'v38.0',  // optional, defaults to current salesforce API version
	environment: 'production',  // optional, salesforce 'sandbox' or 'production', production default
	mode: 'multi' // optional, 'single' or 'multi' user mode, multi default
});

var app = express();

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
  res.redirect(org.getAuthUri());
});

app.get('/oauthcallback', function(req, res) {
	org.authenticate({code: req.query.code}, function(err, resp){
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