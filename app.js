
var express = require('express');
var oauth = require('./lib/oauth');
var app = express();
var port = process.env.PORT || 3000;

// Require Routes js
var routesHome = require('./routes/home');

// Serve static files
app.use(express.static(__dirname + '/public'));

app.use('/home', routesHome);

app.set('view engine', 'ejs');

app.get('/', function(req,res){
	console.log('before redirectAuthURI');
	oauth.redirectAuthURI(req, res, app);
});

app.get('/oauthcallback', function(req, res, app) {
	console.log('before redirectAuthURI');
	if (oauth.authenticate(req, app)) {
		res.redirect('/home');
	}
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);