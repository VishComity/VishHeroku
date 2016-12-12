var connection = require('./lib/connection');
var oauth = {};

oauth.authenticate = function(req, res, app) {
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
};


oauth.redirectAuthURI = function(req, res, app) {
	app.get('/', function(req,res){
	  res.redirect(connection.org.getAuthUri());
	});
};

module.oauth = oauth;
