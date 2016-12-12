
console.log('1');
var express = require('express');
console.log('2');
var oauth = require('./lib/oauth');
console.log('3');
var app = express();
console.log('4');
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
	oauth.authenticate(req, res, app);
});

// Served Localhost
console.log('Served: http://localhost:' + port);
app.listen(port);